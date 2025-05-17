from django.utils import timezone
from MallAPI.models.delivery_model import DeliveryOrder
from MallAPI.models.payment_model import Payment
from MallAPI.models.user_model import User

class DeliveryService:
    @staticmethod
    def assign_delivery(payment_id):
        """Assign a delivery to an available delivery user"""
        try:
            payment = Payment.objects.get(id=payment_id)
            
            # Find any delivery user
            delivery_user = User.objects.filter(role='DELIVERY').first()
            
            if not delivery_user:
                raise ValueError("No delivery users available")
            
            # Check if delivery order already exists
            delivery_order, created = DeliveryOrder.objects.get_or_create(
                payment=payment,
                defaults={
                    'delivery_user': delivery_user,
                    'status': 'PENDING'
                }
            )
            
            if not created:
                print(f"Delivery order already exists for payment {payment_id}")
            else:
                print(f"Created new delivery order {delivery_order.id}")
                
            return delivery_order
            
        except Payment.DoesNotExist:
            raise ValueError(f"Payment {payment_id} not found")
        except Exception as e:
            raise ValueError(f"Error assigning delivery: {str(e)}")

    @staticmethod
    def update_delivery_status(delivery_id, status, user):
        """Update delivery status"""
        try:
            # Get active order that belongs to this delivery user
            delivery = DeliveryOrder.objects.get(
                id=delivery_id,
                delivery_user=user,
                status__in=['PENDING', 'IN_PROGRESS']  # Can only update active orders
            )
            
            # Validate status transition
            valid_transitions = {
                'PENDING': ['IN_PROGRESS'],
                'IN_PROGRESS': ['DELIVERED']
            }
            
            if status not in valid_transitions.get(delivery.status, []):
                raise ValueError(
                    f"Invalid status transition from {delivery.status} to {status}"
                )
            
            delivery.status = status
            if status == 'DELIVERED':
                delivery.delivered_at = timezone.now()
                
            delivery.save()
            return delivery
            
        except DeliveryOrder.DoesNotExist:
            raise ValueError("Active delivery order not found or not authorized")

    @staticmethod
    def get_delivery_user_orders(user):
        """Get all active (non-delivered) orders assigned to a delivery user"""
        return DeliveryOrder.objects.filter(
            delivery_user=user,
            status__in=['PENDING', 'IN_PROGRESS']  # Only get active orders
        ).select_related('payment__user').order_by('-assigned_at')

    @staticmethod
    def get_delivery_user_history(user):
        """Get delivery history (completed deliveries)"""
        return DeliveryOrder.objects.filter(
            delivery_user=user,
            status='DELIVERED'
        ).select_related('payment__user').order_by('-delivered_at') 