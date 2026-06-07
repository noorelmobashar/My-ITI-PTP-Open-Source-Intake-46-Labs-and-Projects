import logging
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import SupportSession, ChatMessage
from .serializers import ChatMessageSerializer
import json

class ChatInteractionView(APIView):
    def post(self, request, *args, **kwargs):
        logger = logging.getLogger('ai_support')
        logger.info(f"Received chat request from user. Payload: {request.data}")
        
        # Extract data from the request
        user_text = request.data.get('user_text')
        session_id = request.data.get('session_id')
        
        # user_text is required
        if not user_text:
            logger.warning("Chat request failed: user_text is missing.")
            return Response(
                {"error": "user_text is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Retrieve or create a new session
        if session_id:
            session = get_object_or_404(SupportSession, id=session_id)
        else:
            session = SupportSession.objects.create()

        # Save the user's message to the database
        message = ChatMessage.objects.create(
            session=session,
            user_text=user_text
        )

        n8n_webhook_url = "http://localhost:5678/webhook/chat"
        payload = {
            "session_id": str(session.id),
            "message_id": message.id,
            "user_text": user_text
        }

        try:
            # Make the POST request to the n8n webhook and wait for JSON response
            response = requests.post(n8n_webhook_url, json=payload, timeout=1000)
            response.raise_for_status()
            logger.info(f"Response from n8n: {response.text}")
            # The expected JSON response from the webhook
            raw_text = response.text.strip()
            n8n_data = json.loads(raw_text)
            
            # Update the message with the AI's response and any tools used
            message.ai_response = n8n_data.get('ai_response', '')
            message.tools_used = n8n_data.get('tools_used', [])
            message.save()
            logger.info(f"Successfully processed response from n8n for session_id: {session.id}. AI tools extracted: {message.tools_used}")

        except requests.exceptions.RequestException as e:
            # If the webhook fails, handle the exception and optionally save an error state
            logger.error(f"Failed to communicate with the AI webhook (n8n). Error: {str(e)}")
            message.ai_response = f"External AI service error: {str(e)}"
            message.save()
            return Response({
                "error": "Failed to communicate with the AI webhook.",
                "details": str(e),
                "message": ChatMessageSerializer(message).data
            }, status=status.HTTP_502_BAD_GATEWAY)
        except ValueError:
            # Handle non-JSON responses from the webhook
            logger.error("Failed to parse JSON from the AI webhook response.")
            message.ai_response = "Invalid JSON response from external AI service."
            message.save()
            return Response({
                "error": "Failed to parse JSON from the AI webhook.",
                "message": ChatMessageSerializer(message).data
            }, status=status.HTTP_502_BAD_GATEWAY)

        # Return the updated message to the frontend
        serializer = ChatMessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_200_OK)
