# Next.js v16 Lab 2 — E-Commerce Application Documentation

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Next.js Image Component](#2-nextjs-image-component)
3. [next/font — Custom Fonts](#3-nextfont--custom-fonts)
4. [App Router & Dynamic Routing](#4-app-router--dynamic-routing)
5. [Navigation with `<Link>`](#5-navigation-with-link)
6. [Data Fetching & Caching Strategies](#6-data-fetching--caching-strategies)
7. [Static Site Generation (SSG)](#7-static-site-generation-ssg)
8. [Incremental Static Regeneration (ISR)](#8-incremental-static-regeneration-isr)
9. [Dynamic Metadata — `generateMetadata`](#9-dynamic-metadata--generatemetadata)
10. [Server Actions & Form Handling](#10-server-actions--form-handling)
11. [URL Search Parameters](#11-url-search-parameters)
12. [Loading & Error Handling](#12-loading--error-handling)
13. [Server vs Client Components](#13-server-vs-client-components)

---

## 1. Project Structure

```
app/
├── layout.tsx              # Root layout (Navbar, Footer, fonts)
├── page.tsx                # Home page — product list
├── loading.tsx             # Home loading skeleton
├── error.tsx               # Home error boundary
├── not-found.tsx           # Custom 404 page
├── globals.css             # Global styles
├── components/
│   ├── Navbar.tsx          # Reusable navigation bar
│   ├── Footer.tsx          # Reusable footer
│   ├── ProductCard.tsx     # Reusable product card
│   ├── SearchBar.tsx       # Client component — search with URL params
│   ├── ReviewForm.tsx      # Client component — Server Action form
│   └── Newsletter.tsx      # Client component — newsletter subscription
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── api.ts              # Data fetching functions with caching
│   └── actions.ts          # Server Actions (review, newsletter)
├── products/
│   └── [id]/
│       ├── page.tsx        # Product detail (dynamic route + ISR)
│       └── loading.tsx     # Product detail loading skeleton
├── categories/
│   ├── page.tsx            # All categories (SSG)
│   └── [slug]/
│       └── page.tsx        # Category products (ISR)
└── contact/
    └── page.tsx            # Contact page with newsletter
```

---

## 2. Next.js Image Component

**File:** `app/components/ProductCard.tsx`, `app/products/[id]/page.tsx`

The `<Image>` component from `next/image` replaces the standard `<img>` tag with automatic optimizations:

### How It Works

```tsx
import Image from "next/image";

// Example from ProductCard.tsx
<Image
  src={product.images[0]}    // Remote URL from API
  alt={product.title}         // Accessible alt text
  fill                        // Fills the parent container
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

// Example from product detail page
<Image
  src={product.images[0]}
  alt={product.title}
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  priority                    // Eagerly loads above-fold images
/>
```

### Key Features

| Feature | Description |
|---------|-------------|
| **Automatic Resizing** | Generates multiple sizes and serves the best one for the user's viewport |
| **Lazy Loading** | Images below the fold are loaded only when they scroll into view (default behavior) |
| **`priority`** | Disables lazy loading for above-fold images (LCP optimization) |
| **`fill`** | Makes the image fill its parent container (parent must have `position: relative`) |
| **`sizes`** | Tells the browser how wide the image will be at different viewports, enabling responsive image selection |
| **Format Conversion** | Automatically converts to WebP/AVIF for browsers that support them |
| **Caching** | Optimized images are cached on the server and served from cache on subsequent requests |

### Configuration in `next.config.ts`

Remote images require explicit allowlisting:

```ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        pathname: "/product-images/**",
      },
    ],
  },
};
```

Without this, Next.js blocks remote images for security (prevents SSRF attacks).

---

## 3. next/font — Custom Fonts

**File:** `app/layout.tsx`

`next/font` automatically self-hosts fonts — **no requests to Google Fonts at runtime**.

```tsx
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",   // CSS custom property name
  subsets: ["latin"],               // Only load Latin characters
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Applied to <html> element:
<html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
```

### How It Works

1. **At build time**, Next.js downloads the font files from Google Fonts
2. **Bundles them** into the `.next/static` directory
3. **Serves them** from the same domain as your app — **zero external requests**
4. **Applies `font-display: swap`** by default — text renders immediately with a fallback font, then swaps to the custom font
5. **CSS variables** (`--font-geist-sans`) let you reference fonts anywhere in CSS

### Why Not Just Use a `<link>` Tag?

- External font requests **block rendering** and create layout shift (CLS)
- `next/font` eliminates the network request entirely
- The font is available **instantly** since it's served from your own server

---

## 4. App Router & Dynamic Routing

### App Router

The App Router uses a **file-system based router** where folders define routes:

```
app/page.tsx          →  /
app/categories/page.tsx  →  /categories
app/contact/page.tsx     →  /contact
```

### Dynamic Routes

**File:** `app/products/[id]/page.tsx`

Square brackets `[id]` create a dynamic route segment:

```
app/products/[id]/page.tsx  →  /products/1, /products/2, etc.
```

```tsx
interface ProductPageProps {
  params: Promise<{ id: string }>;   // Next.js 16: params is a Promise
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;       // Await the params
  const product = await getProductById(Number(id));
  // ...
}
```

> **Next.js 16 Change:** `params` and `searchParams` are now **Promises** that must be awaited. This enables better streaming and partial rendering.

---

## 5. Navigation with `<Link>`

**File:** `app/components/Navbar.tsx`, `app/components/ProductCard.tsx`

The `<Link>` component from `next/link` provides **client-side navigation**:

```tsx
import Link from "next/link";

<Link href="/">Home</Link>
<Link href="/categories">Categories</Link>
<Link href={`/products/${product.id}`}>View Product</Link>
<Link href="/" className="back-link">← Back to Products</Link>
```

### How It Differs from `<a>`

| Feature | `<a>` | `<Link>` |
|---------|-------|----------|
| Navigation | Full page reload | Client-side (no reload) |
| Prefetching | None | Automatically prefetches linked pages |
| History | Replaces history | Integrates with browser history |
| Performance | Slow | Fast — only fetches the diff |

### Prefetching Behavior

- Links **in the viewport** are prefetched automatically
- Static routes are fully prefetched
- Dynamic routes prefetch up to the nearest `loading.tsx` boundary

---

## 6. Data Fetching & Caching Strategies

**File:** `app/lib/api.ts`

Next.js extends the native `fetch` API with caching options:

### Strategy 1: Static (force-cache)

```tsx
const res = await fetch(url, {
  cache: "force-cache",  // Default in Next.js
});
```

- Data is fetched **once at build time**
- Cached **indefinitely** until the next build
- Equivalent to `getStaticProps` in Pages Router
- **Used for:** Categories list, product list on home page

### Strategy 2: Dynamic (no-store)

```tsx
const res = await fetch(url, {
  cache: "no-store",
});
```

- **Never cached** — every request hits the API
- Equivalent to `getServerSideProps` in Pages Router
- **Used for:** Search results (must always be fresh)

### Strategy 3: ISR (revalidate)

```tsx
const res = await fetch(url, {
  next: { revalidate: 60 },  // Re-fetch every 60 seconds
});
```

- Data is cached but **expires after 60 seconds**
- First request after expiry serves stale data, triggers revalidation in the background
- Subsequent requests get fresh data
- **Used for:** Product detail pages, category product listings

### Comparison Table

| Strategy | Option | When to Use | Freshness |
|----------|--------|-------------|-----------|
| Static | `cache: "force-cache"` | Data that rarely changes | Stale until rebuild |
| Dynamic | `cache: "no-store"` | User-specific or real-time data | Always fresh |
| ISR | `next: { revalidate: N }` | Data that changes periodically | Fresh within N seconds |

---

## 7. Static Site Generation (SSG)

**Files:** `app/categories/page.tsx`, `app/products/[id]/page.tsx`

### What is SSG?

Pages are **pre-rendered at build time** as static HTML. They load instantly because there's no server computation at request time.

### How We Use It

**Categories Page** — uses `force-cache` so data is fetched once at build time:

```tsx
// app/categories/page.tsx
export default async function CategoriesPage() {
  const categories = await getCategories(); // force-cache
  // Rendered at build time, served as static HTML
}
```

**Product Pages** — `generateStaticParams` tells Next.js which pages to pre-render:

```tsx
// app/products/[id]/page.tsx
export async function generateStaticParams() {
  const ids = await getAllProductIds();
  return ids.map((id) => ({ id: String(id) }));
}
```

At build time, Next.js calls `generateStaticParams()` to get all product IDs, then pre-renders `/products/1`, `/products/2`, etc.

---

## 8. Incremental Static Regeneration (ISR)

**File:** `app/products/[id]/page.tsx`, `app/categories/[slug]/page.tsx`

ISR combines the speed of SSG with the freshness of SSR:

```tsx
const res = await fetch(`${BASE_URL}/products/${id}`, {
  next: { revalidate: 60 },
});
```

### How ISR Works (Timeline)

```
Build Time:      Page generated with initial data
                          ↓
0-60 seconds:    Cached page served instantly
                          ↓
After 60s:       Next request serves stale page
                 BUT triggers background revalidation
                          ↓
Next request:    Serves freshly generated page
                          ↓
Cycle repeats...
```

### Key Benefit

Users always get a fast response (cached HTML), but the data stays reasonably fresh. It's the best of both worlds between SSG and SSR.

---

## 9. Dynamic Metadata — `generateMetadata`

**File:** `app/products/[id]/page.tsx`

### Static Metadata (layout or page level)

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: "ShopVault — Premium E-Commerce",
    template: "%s | ShopVault",   // Template for child pages
  },
  description: "Discover premium products...",
};
```

The `template` pattern means child pages only set their title, and it's automatically formatted:
- Child sets `title: "Red Lipstick"` → rendered as `"Red Lipstick | ShopVault"`

### Dynamic Metadata (per product)

```tsx
// app/products/[id]/page.tsx
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(Number(id));

  return {
    title: product.title,                    // "Red Lipstick | ShopVault"
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images,               // Social media preview images
    },
  };
}
```

`generateMetadata` runs **on the server** before the page renders. Next.js deduplicates the fetch — if the page also calls `getProductById`, the data is fetched only once.

---

## 10. Server Actions & Form Handling

**Files:** `app/lib/actions.ts`, `app/components/ReviewForm.tsx`

### What Are Server Actions?

Server Actions are **async functions that run on the server**, invoked directly from client components. No need to create API routes.

### Defining a Server Action

```tsx
// app/lib/actions.ts
"use server";  // This directive makes ALL exports Server Actions

export async function submitReview(
  _prevState: ReviewFormState,    // Previous form state
  formData: FormData              // Native FormData from the form
): Promise<ReviewFormState> {
  // Validate
  const name = formData.get("name") as string;
  if (!name || name.trim().length < 2) {
    return { success: false, message: "Error", errors: { name: "Too short" } };
  }

  // Process (save to DB, etc.)
  await saveToDatabase(name, ...);

  return { success: true, message: "Review submitted!" };
}
```

### Using a Server Action in a Client Component

```tsx
// app/components/ReviewForm.tsx
"use client";

import { useActionState } from "react";
import { submitReview } from "../lib/actions";

export default function ReviewForm({ productId }: { productId: number }) {
  const [state, formAction, isPending] = useActionState(submitReview, initialState);

  return (
    <form action={formAction}>
      <input name="name" />
      {state.errors?.name && <span className="error">{state.errors.name}</span>}
      <button disabled={isPending}>
        {isPending ? "Submitting..." : "Submit"}
      </button>
      {state.success && <div className="success">{state.message}</div>}
    </form>
  );
}
```

### `useActionState` Hook

| Return Value | Description |
|-------------|-------------|
| `state` | Current state returned by the action |
| `formAction` | Function to pass to `<form action={...}>` |
| `isPending` | `true` while the action is executing |

### Validation Flow

1. User submits the form
2. `formAction` serializes the form data and sends it to the server
3. The Server Action validates the data
4. Returns errors → component re-renders showing error messages
5. Returns success → component shows success message

---

## 11. URL Search Parameters

**File:** `app/components/SearchBar.tsx`, `app/page.tsx`

### Client Component — Reading & Writing Search Params

```tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/?q=${encodeURIComponent(query)}`);
  };
  // ...
}
```

### Server Component — Consuming Search Params

```tsx
// app/page.tsx
interface HomeProps {
  searchParams: Promise<{ q?: string }>;  // Next.js 16: Promise
}

export default async function Home({ searchParams }: HomeProps) {
  const { q } = await searchParams;

  // Use dynamic fetch for search, static for default
  const data = q ? await searchProducts(q) : await getProducts();
}
```

### Flow

1. User types "phone" and hits Enter
2. `SearchBar` calls `router.push("/?q=phone")`
3. URL changes to `/?q=phone`
4. Next.js re-renders the page with `searchParams.q = "phone"`
5. `searchProducts("phone")` is called with `cache: "no-store"` (dynamic)

---

## 12. Loading & Error Handling

### `loading.tsx` — Instant Loading States

**Files:** `app/loading.tsx`, `app/products/[id]/loading.tsx`

When placed alongside a `page.tsx`, Next.js **automatically wraps** the page in a `<Suspense>` boundary and shows `loading.tsx` while the page's async data loads.

```tsx
// app/loading.tsx
export default function Loading() {
  return (
    <div className="loading-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="skeleton skeleton-card" />
      ))}
    </div>
  );
}
```

The loading UI shows **instantly** (it's static HTML), giving users immediate feedback.

### `error.tsx` — Error Boundaries

**File:** `app/error.tsx`

Must be a **client component** (`"use client"`) because it uses React's error boundary API:

```tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;          // Re-renders the page
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try Again</button>
    </div>
  );
}
```

### `not-found.tsx` — Custom 404

**File:** `app/not-found.tsx`

Triggered by calling `notFound()` from any server component:

```tsx
import { notFound } from "next/navigation";

export default async function ProductPage({ params }) {
  const product = await getProduct(id);
  if (!product) notFound();  // Shows not-found.tsx
}
```

---

## 13. Server vs Client Components

### Server Components (Default)

Every component in the App Router is a **Server Component** by default:

- Runs on the server only
- Can `await` async operations directly
- Can access databases, file system, environment variables
- **Cannot** use hooks (`useState`, `useEffect`, etc.)
- **Cannot** use browser APIs (`window`, `document`, etc.)
- Zero JavaScript sent to the client

**Examples in this project:** `page.tsx`, `layout.tsx`, `ProductCard.tsx`, `Navbar.tsx`, `Footer.tsx`

### Client Components

Add `"use client"` at the top of the file:

- Runs on both server (initial render) and client (hydration + interactions)
- Can use React hooks and browser APIs
- JavaScript bundle is sent to the client

**Examples in this project:** `SearchBar.tsx`, `ReviewForm.tsx`, `Newsletter.tsx`, `error.tsx`

### When to Use Which?

| Need | Use |
|------|-----|
| Fetch data | Server Component |
| Access backend resources | Server Component |
| Static UI (no interactivity) | Server Component |
| Form input / user interactions | Client Component |
| useState / useEffect | Client Component |
| Browser APIs | Client Component |
| Event handlers (onClick, etc.) | Client Component |

### The Pattern We Use

Server Components **compose** Client Components, not the other way around:

```
layout.tsx (Server)
├── Navbar.tsx (Server) — static navigation links
├── page.tsx (Server) — fetches data
│   ├── SearchBar.tsx (Client) — user input
│   └── ProductCard.tsx (Server) — display only
└── Footer.tsx (Server) — static footer
```

---

## Summary of Lab Requirements Coverage

| # | Requirement | Implementation |
|---|------------|----------------|
| 1 | Home page with product list | `app/page.tsx` |
| 2 | Product Details with dynamic routing | `app/products/[id]/page.tsx` |
| 3 | Navigation with Next.js Link | `Navbar.tsx`, `ProductCard.tsx`, back links |
| 4 | Next.js Image component | `ProductCard.tsx`, product detail page |
| 5 | Custom font via next/font | `layout.tsx` — Geist font |
| 6 | Dynamic metadata | `generateMetadata` in product page |
| 7 | Data fetching with caching | `api.ts` — all functions use `fetch` with cache options |
| 8 | Different caching strategies | Static (`force-cache`), Dynamic (`no-store`), ISR (`revalidate: 60`) |
| 9 | SSG page | Categories page, `generateStaticParams` for products |
| 10 | ISR page | Product detail page (`revalidate: 60`) |
| 11 | Search with URL params | `SearchBar.tsx` + `page.tsx` reading `searchParams` |
| 12 | Server Action | `submitReview` and `subscribeNewsletter` in `actions.ts` |
| 13 | Form validation | Server-side validation in `actions.ts` |
| 14 | Success/error feedback | `ReviewForm.tsx` and `Newsletter.tsx` show state messages |
| 15 | Clean folder structure | Organized into `components/`, `lib/`, route folders |
| 16 | Reusable components | `ProductCard`, `Navbar`, `Footer`, `Newsletter`, `SearchBar` |
| 17 | Loading & error handling | `loading.tsx`, `error.tsx`, `not-found.tsx` |
