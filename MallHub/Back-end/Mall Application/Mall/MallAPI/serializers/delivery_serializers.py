from rest_framework import serializers
from MallAPI.models.delivery_model import DeliveryOrder
from MallAPI.serializers.store_serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source='product.id')
    product_name = serializers.CharField(source='product.name')
    product_image = serializers.SerializerMethodField()
    quantity = serializers.IntegerField()

    class Meta:
        model = DeliveryOrder
        fields = ['product_id', 'product_name', 'product_image', 'quantity']

    def get_product_image(self, obj):
        request = self.context.get('request')
        if obj.product.image and request:
            return request.build_absolute_uri(obj.product.image.url)
        return None

class DeliveryOrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='payment.user.name', read_only=True)
    customer_email = serializers.CharField(source='payment.user.email', read_only=True)
    customer_phone = serializers.CharField(source='payment.user.phone_number', read_only=True)
    customer_address = serializers.CharField(source='payment.user.address', read_only=True)
    payment_id = serializers.CharField(source='payment.payment_id', read_only=True)
    order_items = serializers.SerializerMethodField()
    total_amount = serializers.DecimalField(source='payment.amount', max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = DeliveryOrder
        fields = [
            'id', 'status', 'assigned_at', 'delivered_at',
            'customer_name', 'customer_email', 'customer_phone',
            'customer_address', 'payment_id', 'order_items',
            'total_amount'
        ]
        error_messages = {
            'status': {
                'invalid_choice': 'Invalid delivery status',
                'required': 'Status is required'
            },
            'assigned_at': {
                'invalid': 'Invalid assignment date'
            },
            'delivered_at': {
                'invalid': 'Invalid delivery date'
            }
        }

    def validate(self, data):
        if 'delivered_at' in data and not data.get('assigned_at'):
            raise serializers.ValidationError("Order must be assigned before delivery")
        return data

    def get_order_items(self, obj):
        # Get cart items from the payment's cart
        cart_items = obj.payment.cart.items.all()
        return OrderItemSerializer(
            cart_items, 
            many=True,
            context={'request': self.context.get('request')}
        ).data 