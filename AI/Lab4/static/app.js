/**
 * Sentiment Inbox — Client-Side Logic
 * Handles form validation, submission via fetch, and state transitions.
 */

document.addEventListener("DOMContentLoaded", () => {
    // --- DOM References ---
    const form = document.getElementById("sentiment-form");
    const emailInput = document.getElementById("customer-email");
    const messageInput = document.getElementById("message");
    const submitBtn = document.getElementById("submit-btn");
    const charCount = document.getElementById("char-count");

    const emailError = document.getElementById("email-error");
    const messageError = document.getElementById("message-error");
    const emailGroup = document.getElementById("email-group");
    const messageGroup = document.getElementById("message-group");

    const formCard = document.getElementById("form-card");
    const successCard = document.getElementById("success-card");
    const errorCard = document.getElementById("error-card");
    const errorMessage = document.getElementById("error-message");

    const resetBtn = document.getElementById("reset-btn");
    const retryBtn = document.getElementById("retry-btn");

    const MAX_CHARS = 1000;

    // --- Character Counter ---
    messageInput.addEventListener("input", () => {
        const len = messageInput.value.length;
        charCount.textContent = `${len} / ${MAX_CHARS}`;
        if (len > MAX_CHARS) {
            charCount.style.color = "var(--accent-red)";
        } else {
            charCount.style.color = "";
        }
    });

    // --- Validation Helpers ---
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function clearErrors() {
        emailError.textContent = "";
        messageError.textContent = "";
        emailGroup.classList.remove("form-group--invalid");
        messageGroup.classList.remove("form-group--invalid");
    }

    function validate() {
        clearErrors();
        let valid = true;

        if (!emailInput.value.trim()) {
            emailError.textContent = "Please enter your email address.";
            emailGroup.classList.add("form-group--invalid");
            valid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
            emailError.textContent = "Please enter a valid email address.";
            emailGroup.classList.add("form-group--invalid");
            valid = false;
        }

        if (!messageInput.value.trim()) {
            messageError.textContent = "Please enter your message.";
            messageGroup.classList.add("form-group--invalid");
            valid = false;
        } else if (messageInput.value.length > MAX_CHARS) {
            messageError.textContent = `Message must be under ${MAX_CHARS} characters.`;
            messageGroup.classList.add("form-group--invalid");
            valid = false;
        }

        return valid;
    }

    // --- State Transitions ---
    function showState(state) {
        formCard.style.display = state === "form" ? "" : "none";
        successCard.classList.toggle("visible", state === "success");
        successCard.setAttribute("aria-hidden", state !== "success");
        errorCard.classList.toggle("visible", state === "error");
        errorCard.setAttribute("aria-hidden", state !== "error");
    }

    function setLoading(loading) {
        submitBtn.disabled = loading;
        submitBtn.classList.toggle("btn-submit--loading", loading);
    }

    // --- Form Submission ---
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!validate()) {
            form.classList.add("shake");
            setTimeout(() => form.classList.remove("shake"), 400);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customer_email: emailInput.value.trim(),
                    message: messageInput.value.trim(),
                }),
            });

            const data = await res.json();

            if (data.success) {
                showState("success");
            } else {
                errorMessage.textContent = data.error || "An unexpected error occurred.";
                showState("error");
            }
        } catch (err) {
            errorMessage.textContent = "Network error. Please check your connection and try again.";
            showState("error");
        } finally {
            setLoading(false);
        }
    });

    // --- Reset Handlers ---
    function resetForm() {
        form.reset();
        charCount.textContent = `0 / ${MAX_CHARS}`;
        charCount.style.color = "";
        clearErrors();
        showState("form");
    }

    resetBtn.addEventListener("click", resetForm);
    retryBtn.addEventListener("click", resetForm);

    // --- Input focus micro-interactions ---
    [emailInput, messageInput].forEach((input) => {
        input.addEventListener("focus", () => {
            input.closest(".form-group").classList.remove("form-group--invalid");
            const errorEl = input.closest(".form-group").querySelector(".form-error");
            if (errorEl) errorEl.textContent = "";
        });
    });
});
