from rest_framework import serializers
from .models import SupportSession, ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'session', 'user_text', 'ai_response', 'tools_used', 'created_at']
        read_only_fields = ['id', 'ai_response', 'tools_used', 'created_at']

class SupportSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = SupportSession
        fields = ['id', 'created_at', 'updated_at', 'messages']
        read_only_fields = ['id', 'created_at', 'updated_at']
