"use client";

import { useActionState } from "react";
import { subscribeNewsletter, NewsletterFormState } from "../lib/actions";

export default function Newsletter() {
  const initialState: NewsletterFormState = { success: false, message: "" };
  const [state, formAction, isPending] = useActionState(subscribeNewsletter, initialState);

  return (
    <section className="newsletter">
      <h2>Subscribe to our Newsletter</h2>
      <p>Stay updated on the latest arrivals, exclusive offers, and product reviews.</p>

      {state.message && (
        <div style={{ marginBottom: "1rem" }} className={`form-message ${state.success ? "success" : "error"}`}>
          {state.message}
        </div>
      )}

      <form action={formAction} className="newsletter-form">
        <input
          type="email"
          name="email"
          id="newsletter-email"
          placeholder="Enter your email"
          aria-label="Email address"
          required
        />
        <button type="submit" className="btn btn-primary" id="subscribe-btn" disabled={isPending}>
          {isPending ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
    </section>
  );
}
