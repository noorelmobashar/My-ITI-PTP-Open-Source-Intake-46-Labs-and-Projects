# Lab 5: Email Notifications & Payment Integration (Kashier + Gmail)

## Overview

In this lab you will extend the authenticated Node.js API you built in **Lab 4** by adding two real-world third-party integrations that almost every production app needs:

1. **Transactional email** delivered through **Gmail** using Nodemailer and EJS templates.
2. **Online payments** through the **Kashier** payment gateway, including the secure verification of asynchronous webhooks.

By the end of this lab your API will be able to send a welcome email when a new user signs up, generate a hosted payment page on Kashier so a logged-in user can make a donation, and reliably update the donation status when Kashier calls back through a webhook.

## Prerequisites

- You have completed **Lab 4** (signup/login with JWT, role-based authorization, security middlewares, global error handler, `APIError` class, `validate` middleware, MongoDB with Mongoose).
- You have a Gmail account with **2-Step Verification** enabled (required to generate an App Password).
- You have signed up for a **Kashier** test merchant account at https://test.kashier.io and have your `MERCHANT ID`, `API KEY`, and `SECRET KEY` from the dashboard.
- You have **ngrok** installed (or any other tunneling tool) so Kashier can reach your local webhook endpoint over HTTPS.

---

## Learning Objectives

By the end of this lab, you should be able to:

- Send HTML emails from a Node.js server using Nodemailer and a Gmail App Password.
- Render dynamic HTML emails from EJS templates so content is data-driven.
- Integrate a third-party payment gateway (Kashier) by calling its REST API with `axios`.
- Persist payment sessions in MongoDB and link them to the authenticated user who initiated them.
- Receive and **securely verify** asynchronous webhook callbacks using an HMAC SHA-256 signature.
- Expose a local server to the public internet for webhook testing using ngrok.

---

## Part 1 — Email Service with Gmail

### 1.1 Generate a Gmail App Password

1. Enable **2-Step Verification** on your Google account.
2. Visit https://myaccount.google.com/apppasswords and create a new App Password (name it e.g. `node-mansoura-lab`).
3. Copy the 16-character password. Treat it like any other secret — never commit it.

### 1.2 Install dependencies

Install `nodemailer` (the mail client) and `ejs` (the templating engine):

```bash
npm install nodemailer ejs
```

### 1.3 Add environment variables

Add the following keys to your `.env` file (no quotes, no spaces around `=`):

```
EMAIL_USER=your.gmail.address@gmail.com
EMAIL_PASS=your16charAppPassword
```

### 1.4 Create the email template

Create a new folder `views/emails` at the project root and inside it create `welcome.ejs`. The template must:

- Greet the user by their name (passed in as a variable, e.g. `<%= name %>`).
- Include a short welcome message.
- Include a link back to your sign-in endpoint.

> EJS uses `<%= variable %>` to interpolate values — no JSX or React knowledge needed.

### 1.5 Create the email service

Create `services/emailService.js` that exposes a single function:

```js
sendEmail(template, data, to, subject)
```

It must:

1. Create a **Nodemailer transporter** configured to use the `gmail` service with `EMAIL_USER` / `EMAIL_PASS` from `process.env`.
2. Resolve the absolute path to `views/emails/<template>.ejs` using the `path` module.
3. Render the template with the supplied `data` using `ejs.renderFile(...)`.
4. Send the email with the rendered HTML as the body, your Gmail as `from`, and the supplied `to` and `subject`.
5. Be fully `async/await` based.

> Do **not** swallow errors silently here. Let them bubble so the global error handler can decide what to do, or wrap the call in `try/catch` only where you have a real recovery plan.

### 1.6 Send the welcome email on sign-up

Update `controllers/usersController.js` so that the `signUp` handler calls `emailService.sendEmail(...)` with:

- Template: `"welcome"`
- Data: `{ name: newUser.name }`
- Recipient: `newUser.email`
- Subject: `"Welcome to our platform"`

The welcome email must be sent **after** the user has been successfully created in MongoDB.

---

## Part 2 — Donation Resource with Kashier

In this part you will introduce a brand-new `Donation` resource. An authenticated user can create a donation; the server creates a Kashier payment session and returns the hosted payment URL. The user pays on Kashier's page, and Kashier calls our webhook to tell us whether the payment succeeded or failed.

### 2.1 Install dependencies

```bash
npm install axios query-string@6 underscore
```

> ⚠️ Use `query-string@6` (CommonJS). Version 7+ is ESM-only and will not `require()` cleanly.

Add the following to your `.env`:

```
KASHIER_MERCHANT_ID=your_kashier_merchant_id
KASHIER_API_KEY=your_kashier_api_key
KASHIER_SECRET_KEY=your_kashier_secret_key
KASHIER_WEBHOOK_URL=https://<your-ngrok-subdomain>.ngrok-free.app/donations/webhook
```

### 2.2 Create the Donation model

Create `models/donations.js` with the following Mongoose schema:

| Field               | Type     | Rules                                           |
| ------------------- | -------- | ----------------------------------------------- |
| `amount`            | Number   | required                                        |
| `status`            | String   | enum: `pending` / `completed` / `failed`, default `pending` |
| `user`              | ObjectId | ref `User`, required                            |
| `providerSessionId` | String   | optional (filled after we call Kashier)         |
| `link`              | String   | optional (the hosted payment URL)               |

Enable `timestamps: true`.

### 2.3 Create the donation validation schema

Create `validations/donations/createDonationSchema.js` using **joi**. Validate the request body:

- `amount` — number, minimum **10**, required.
- Reject unknown keys.

Export it in the shape your `validate` middleware expects (i.e. `{ body: <joiSchema> }`).

### 2.4 Create the donation service

Create `services/donationService.js` exposing:

- `createDonation(amount, userId)` — persists a new donation with status `pending`.
- `updateDonation(id, data)` — updates a donation by id and returns the updated document.
- `createPaymentLink(donation)` — calls the **Kashier Payment Sessions API** and returns the parsed response.

For `createPaymentLink` use `axios.post` to:

```
POST https://test-api.kashier.io/v3/payment/sessions
```

Headers:

```
Authorization: <KASHIER_SECRET_KEY>
api-key:       <KASHIER_API_KEY>
```

Body (send the donation `_id` as `order`, the donation amount as a string, EGP, one-time, `card,wallet`, enable 3DS, etc.). Use `KASHIER_WEBHOOK_URL` from `.env` as the `serverWebhook` so Kashier knows where to call you back.

> Read the request body fields from the working sample in this lab's solution doc or from Kashier's documentation; keep the shape they require.

### 2.5 Create the donation controller

Create `controllers/donationController.js` with two handlers:

**`createDonation(req, res)`**

1. Create a `pending` donation for the authenticated user (`req.user.id`) with the requested amount.
2. Call `createPaymentLink(donation)` to get back a Kashier session.
3. Save the `providerSessionId` (Kashier's `_id`) and the hosted payment `link` (`sessionUrl`) on our donation record.
4. Respond `200` with the updated donation document.

**`handleWebhook(req, res)`**

1. Read `req.body.data`.
2. From the payload extract `merchantOrderId` (our donation `_id`) and `status`.
3. Map Kashier's `SUCCESS` to our `completed`, anything else to `failed`.
4. Update the donation's `status`.
5. Respond `200` with a small acknowledgement payload.

> The webhook **must not** be protected by `authenticate` — Kashier's servers will not send a JWT. We protect it differently (next step).

### 2.6 Create the Kashier signature validation middleware

Create `middlewares/validateKashierHash.js`. Its job is to make sure the webhook actually came from Kashier and not a malicious client.

Steps:

1. Read `data` and `event` from `req.body`.
2. Sort `data.signatureKeys` alphabetically (Kashier expects this).
3. Pick only the fields named in `signatureKeys` from `data` (use `underscore`'s `_.pick`).
4. Convert that object to a URL-encoded query string with `query-string`'s `stringify`.
5. Compute `HMAC-SHA256(payload, KASHIER_API_KEY)` and hex-digest it.
6. Compare against the value of the `x-kashier-signature` request header.
7. If they don't match, throw `new APIError("Invalid signature", 401)`.

Wire it up in `middlewares/index.js`.

### 2.7 Create the donations router

Create `routes/donationsRouter.js` with:

| Method | Path        | Middlewares                                      |
| ------ | ----------- | ------------------------------------------------ |
| POST   | `/`         | `authenticate`, `validate(createDonationSchema)` |
| POST   | `/webhook`  | `validateKashierHash`                            |

Mount it on `/donations` in `index.js`.

### 2.8 Expose the webhook with ngrok

Kashier needs a **public HTTPS URL** to call your webhook. Start your server and, in a separate terminal, run:

```bash
ngrok http 3000
```

Copy the `https://...ngrok-free.app` URL ngrok prints, update `KASHIER_WEBHOOK_URL` in your `.env`, and restart your server so the new value is picked up.

---

## Part 3 — Donation History, Admin View & Success Receipt Email

Now that donations work end-to-end, you will add the user-facing and admin-facing read endpoints and a second transactional email that gets sent the moment a payment is confirmed.

### 3.1 Donation history endpoint — `GET /donations`

Add a new authenticated endpoint that returns the **current user's** donations:

- Route: `GET /donations`
- Middlewares: `authenticate`
- Behavior: return donations where `user === req.user.id`, **sorted by newest first** (`createdAt` descending).
- Response shape: `{ status: "success", data: [...donations] }`.

Add a `listMyDonations(userId)` method on `donationService` and a `listMyDonations` handler on `donationController` — keep the layering you used in Days 2–4.

### 3.2 Admin donations view — `GET /donations/all`

Add a route restricted to admins that returns **every** donation in the system, with the `user` field populated so the response includes each donor's name and email.

- Route: `GET /donations/all`
- Middlewares: `authenticate`, `authorizeTo("admin")`
- Behavior: return all donations, populated with their `user` (select only `name` and `email` — never leak the password hash).
- Response shape: `{ status: "success", data: [...donations] }`.

Add a `listAllDonations()` method on `donationService` and a `listAllDonations` handler on `donationController`.

> ⚠️ Route ordering matters. `/all` is a literal string but Express still walks the router top-to-bottom, so make sure your handlers don't accidentally treat `"all"` as a dynamic `:id` parameter. (If you add a `GET /donations/:id` later in the file, declare `/all` **before** it.)

### 3.3 Thank-you email on completed donation

When the webhook fires and the payment succeeded, send a second email confirming the donation.

1. Create a new EJS template `views/emails/donationSuccess.ejs` that includes:
   - The donor's name (`<%= name %>`).
   - The amount they donated (`<%= amount %>`).
   - The Kashier order id / our donation id (`<%= donationId %>`) so they can quote it if they need support.
   - A short thank-you message.
2. Update `handleWebhook` in `donationController.js`:
   - After updating the donation, **fetch it back with `user` populated** (`Donation.findById(id).populate("user")`) so you have the user's `name` and `email` available.
   - If the new status is `completed`, call `emailService.sendEmail("donationSuccess", { ... }, donation.user.email, "Thank you for your donation!")`.
   - If the new status is `failed`, do **not** send the receipt email.

> Reuse the existing `sendEmail(...)` function — you should not need to touch `services/emailService.js` at all. That is the whole point of templating: data changes, infrastructure does not.

---

## Manual Test Plan

Run all requests in Postman / Thunder Client.

1. `POST /users/sign-up` — your inbox should receive a welcome email rendered from the EJS template.
2. `POST /users/sign-in` — copy the JWT.
3. `POST /donations` with `Authorization: Bearer <token>` and body `{ "amount": 50 }` — response should contain a `link` URL.
4. Open the `link` in a browser, complete the test payment with the Kashier test card numbers.
5. Watch your server logs — the webhook should fire and the donation's `status` should become `completed` in MongoDB **and** a thank-you email should arrive in the donor's inbox.
6. Repeat with a failed payment — status should become `failed` and **no** receipt email should be sent.
7. `GET /donations` with the donor's token — response should be a list of the donor's donations, newest first.
8. Sign in as an **admin** user (you may need to promote a user in the Mongo shell), then `GET /donations/all` — response should include donations from every user, each with the user's `name` and `email` populated.

---

## Requirements Checklist

- [ ] `services/emailService.js` exists and uses Nodemailer + EJS.
- [ ] Welcome email is sent on a successful sign-up.
- [ ] All credentials (Gmail, Kashier, JWT, DB) are read from `process.env`. **Nothing hard-coded.**
- [ ] `.env` is in `.gitignore`.
- [ ] `Donation` Mongoose model with the required fields and enum status.
- [ ] `POST /donations` is protected with `authenticate` and `validate(...)`.
- [ ] `POST /donations/webhook` is **not** behind `authenticate` and **is** behind `validateKashierHash`.
- [ ] Kashier signature is verified using HMAC-SHA256 with `KASHIER_API_KEY` as the secret, on the `signatureKeys` slice of `data`.
- [ ] Donation status transitions from `pending` → `completed` or `failed` based on the webhook.
- [ ] `GET /donations` returns the authenticated user's donations sorted newest-first.
- [ ] `GET /donations/all` is restricted to admins and returns every donation with the user populated.
- [ ] `donationSuccess.ejs` exists and is rendered into a thank-you email sent **only** when the webhook reports a successful payment.

---

## Bonus Challenges

1. **Idempotent webhook** — Kashier may retry. Make sure receiving the same `data.merchantOrderId` + same final status twice does not double-send the thank-you email. (Hint: only send if the previous status was `pending`.)
2. **Refactor email templates** — extract a shared layout partial (`views/emails/partials/header.ejs`) and reuse it in both `welcome.ejs` and `donationSuccess.ejs` with `<%- include('partials/header') %>`.
3. **Pagination on `GET /donations/all`** — accept `?page` and `?limit` query parameters and use them with `.skip()` / `.limit()`.

---

## Submission

Push the final project to your GitHub. The repository must include:

- A working `index.js` that boots the server and connects to MongoDB.
- A `.env.example` file listing all required environment variable **names** (no values).
- A `README.md` with the steps to run locally (install, env, ngrok, npm run dev).

Good luck and happy coding! ❤️
