"use client";

import Newsletter from "../components/Newsletter";

export default function ContactPage() {
  return (
    <main className="container">
      <section className="hero">
        <h1>Contact Us</h1>
        <p>Have questions? We'd love to hear from you. Get in touch with our team.</p>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", margin: "2rem auto", maxWidth: "900px" }}>
        <div className="review-form" style={{ padding: "2rem" }}>
          <h3>Get In Touch</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            Fill out the form below and we will get back to you as soon as possible.
          </p>
          <form className="form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="contact-name">Name</label>
              <input type="text" id="contact-name" placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label htmlFor="contact-email">Email</label>
              <input type="email" id="contact-email" placeholder="john@example.com" required />
            </div>
            <div className="form-group">
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" placeholder="How can we help you?" style={{ minHeight: "120px" }} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
              Send Message
            </button>
          </form>
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "2rem" }}>
          <div>
            <h3>Visit Our Office</h3>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              100 Innovation Way<br />
              Tech District, NY 10001
            </p>
          </div>
          <div>
            <h3>Support Email</h3>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              support@shopvault.com
            </p>
          </div>
          <div>
            <h3>Call Us</h3>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              +1 (555) 019-2834
            </p>
          </div>
        </div>
      </div>

      <Newsletter />
    </main>
  );
}
