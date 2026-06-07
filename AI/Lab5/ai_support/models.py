import uuid
from django.db import models

class SupportSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Support Session {self.id}"

class ChatMessage(models.Model):
    session = models.ForeignKey(SupportSession, related_name='messages', on_delete=models.CASCADE)
    user_text = models.TextField()
    ai_response = models.TextField(blank=True, null=True)
    tools_used = models.JSONField(blank=True, null=True, default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message {self.id} in Session {self.session.id}"

from django.db import models

class Customer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)

    def __clstr__(self):
        return self.name

class Order(models.Model):
    STATUS_CHOICES = [
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
    ]
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    order_number = models.CharField(max_length=100, unique=True)
    product_name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='processing')
    # This is the secret field for validation
    verification_code = models.CharField(max_length=10, help_text="e.g., last 4 digits of phone")

    def __str__(self):
        return f"{self.order_number} - {self.status}"