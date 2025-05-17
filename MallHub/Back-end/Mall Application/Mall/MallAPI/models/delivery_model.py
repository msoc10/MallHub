from django.db import models
from django.conf import settings
from MallAPI.models.payment_model import Payment

class DeliveryOrder(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Order not yet received'),
        ('IN_PROGRESS', 'Delivery in progress'),
        ('DELIVERED', 'Order delivered')
    ]

    payment = models.OneToOneField(Payment, on_delete=models.CASCADE)
    delivery_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='deliveries'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    assigned_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Delivery {self.id} - {self.status}" 