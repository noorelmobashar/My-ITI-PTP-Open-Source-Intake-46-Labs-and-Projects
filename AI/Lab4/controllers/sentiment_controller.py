from flask import Blueprint, render_template, request, jsonify
from models.sentiment import SentimentModel

sentiment_bp = Blueprint("sentiment", __name__)


@sentiment_bp.route("/", methods=["GET"])
def index():
    """Render the sentiment inbox form."""
    return render_template("index.html")


@sentiment_bp.route("/submit", methods=["POST"])
def submit():
    """
    Handle form submission.
    Accepts JSON with customer_email and message, forwards to n8n webhook.
    """
    data = request.get_json()

    customer_email = data.get("customer_email", "").strip()
    message = data.get("message", "").strip()

    # Basic validation
    if not customer_email or not message:
        return jsonify({"success": False, "error": "Email and message are required."}), 400

    result = SentimentModel.submit(customer_email, message)

    if result["success"]:
        return jsonify({
            "success": True,
            "message": "We've successfully received your inquiry! A personalized email will be sent to you shortly."
        })
    else:
        return jsonify({"success": False, "error": result["error"]}), 500
