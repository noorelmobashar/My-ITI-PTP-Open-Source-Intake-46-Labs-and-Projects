"use server";

export interface ReviewFormState {
  success: boolean;
  message: string;
  errors?: {
    name?: string;
    email?: string;
    rating?: string;
    comment?: string;
  };
}

export async function submitReview(
  _prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const rating = formData.get("rating") as string;
  const comment = formData.get("comment") as string;
  const productId = formData.get("productId") as string;

  const errors: ReviewFormState["errors"] = {};

  if (!name || name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!rating || isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
    errors.rating = "Rating must be between 1 and 5.";
  }

  if (!comment || comment.trim().length < 10) {
    errors.comment = "Review must be at least 10 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors,
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log(`New review for product #${productId}:`, {
    name: name.trim(),
    email: email.trim(),
    rating: Number(rating),
    comment: comment.trim(),
  });

  return {
    success: true,
    message: `Thank you, ${name.trim()}! Your review has been submitted successfully.`,
  };
}

export interface NewsletterFormState {
  success: boolean;
  message: string;
  errors?: {
    email?: string;
  };
}

export async function subscribeNewsletter(
  _prevState: NewsletterFormState,
  formData: FormData
): Promise<NewsletterFormState> {
  const email = formData.get("email") as string;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: { email: "Please enter a valid email address." },
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 800));

  console.log(`Newsletter subscription: ${email}`);

  return {
    success: true,
    message: "You've been subscribed! Check your inbox for a welcome email.",
  };
}
