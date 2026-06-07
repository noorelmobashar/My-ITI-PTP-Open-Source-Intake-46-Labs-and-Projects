from flask import Flask
from controllers.sentiment_controller import sentiment_bp

app = Flask(__name__)
app.register_blueprint(sentiment_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
