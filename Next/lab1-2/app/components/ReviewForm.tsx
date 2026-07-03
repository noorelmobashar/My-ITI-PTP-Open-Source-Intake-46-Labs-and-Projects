"use client";

import { useActionState } from "react";
import { submitReview, ReviewFormState } from "../lib/actions";

export default function ReviewForm({ productId }: { productId: number }) {
  const initialState: ReviewFormState = { success: false, message: "" };
  const [state, formAction, isPending] = useActionState(submitReview, initialState);

  return (
    <div className="review-section">
      <h2>Write a Review</h2>
      <form action={formAction} className="review-form">
        <input type="hidden" name="productId" value={productId} />

        {state.message && (
          <div className={`form-message ${state.success ? "success" : "error"}`}>
            {state.message}
          </div>
        )}

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="review-name">Your Name</label>
            <input type="text" id="review-name" name="name" placeholder="John Doe" required />
            {state.errors?.name && <span className="error-text">{state.errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="review-email">Email</label>
            <input type="email" id="review-email" name="email" placeholder="john@example.com" required />
            {state.errors?.email && <span className="error-text">{state.errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="review-rating">Rating</label>
            <select id="review-rating" name="rating" required>
              <option value="">Select rating</option>
              <option value="5">⭐⭐⭐⭐⭐ (5)</option>
              <option value="4">⭐⭐⭐⭐ (4)</option>
              <option value="3">⭐⭐⭐ (3)</option>
              <option value="2">⭐⭐ (2)</option>
              <option value="1">⭐ (1)</option>
            </select>
            {state.errors?.rating && <span className="error-text">{state.errors.rating}</span>}
          </div>

          <div className="form-group full">
            <label htmlFor="review-comment">Your Review</label>
            <textarea id="review-comment" name="comment" placeholder="Share your experience with this product..." required />
            {state.errors?.comment && <span className="error-text">{state.errors.comment}</span>}
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={isPending} id="submit-review-btn">
          {isPending ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
