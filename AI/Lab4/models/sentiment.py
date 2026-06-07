import requests

N8N_WEBHOOK_URL = "https://noorelmobashar.app.n8n.cloud/webhook/sentiment-inbox"


class SentimentModel:
    """Model responsible for communicating with the n8n sentiment analysis webhook."""

    @staticmethod
    def submit(customer_email: str, message: str) -> dict:
        """
        Sends the customer email and message to the n8n webhook for
        sentiment analysis processing.

        Returns a dict with 'success' (bool) and optionally 'error' (str).
        """
        payload = {
            "customer_email": customer_email,
            "message": message,
        }

        try:
            response = requests.post(
                N8N_WEBHOOK_URL,
                json=payload,
                timeout=15,
            )
            response.raise_for_status()
            return {"success": True, "data": response.json() if response.text else {}}
        except requests.exceptions.Timeout:
            return {"success": False, "error": "The request timed out. Please try again."}
        except requests.exceptions.ConnectionError:
            return {"success": False, "error": "Could not connect to the server. Please try again later."}
        except requests.exceptions.HTTPError as e:
            return {"success": False, "error": f"Server error: {e.response.status_code}"}
        except Exception as e:
            return {"success": False, "error": str(e)}
