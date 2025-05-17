from rest_framework import serializers
from MallAPI.models.cart_model import ShoppingCart, CartItem
from .store_serializers import ProductSerializer
from decimal import Decimal

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()
    product_image_url = serializers.SerializerMethodField()
    is_prize_redemption = serializers.BooleanField(read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'total_price', 'product_image_url', 'is_prize_redemption']
        error_messages = {
            'quantity': {
                'min_value': 'Quantity must be at least 1',
                'max_value': 'Quantity cannot exceed 100'
            }
        }

    def get_total_price(self, obj):
        # Use discounted price if the product has a store discount
        if hasattr(obj.product, 'store') and obj.product.store and obj.product.store.discount_percentage > 0:
            discount = obj.product.price * (Decimal(obj.product.store.discount_percentage) / Decimal('100.0'))
            discounted_price = round(obj.product.price - discount, 2)
            return discounted_price * obj.quantity
        return obj.product.price * obj.quantity

    def get_product_image_url(self, obj):
        if obj.product.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.product.image.url)
        return None

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1")
        if value > 100:
            raise serializers.ValidationError("Quantity cannot exceed 100")
        return value

class ShoppingCartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()
    
    class Meta:
        model = ShoppingCart
        fields = ['id', 'items', 'total', 'created_at', 'updated_at']

    def get_total(self, obj):
        total = 0
        for item in obj.items.all():
            if hasattr(item.product, 'store') and item.product.store and item.product.store.discount_percentage > 0:
                discount = item.product.price * (Decimal(item.product.store.discount_percentage) / Decimal('100.0'))
                discounted_price = round(item.product.price - discount, 2)
                total += discounted_price * item.quantity
            else:
                total += item.product.price * item.quantity
        return total

class CartBillSerializer(ShoppingCartSerializer):
    user_address = serializers.CharField(source='user.address', read_only=True)
    user_phone = serializers.CharField(source='user.phone_number', read_only=True)
    
    class Meta(ShoppingCartSerializer.Meta):
        fields = ShoppingCartSerializer.Meta.fields + ['user_address', 'user_phone'] 