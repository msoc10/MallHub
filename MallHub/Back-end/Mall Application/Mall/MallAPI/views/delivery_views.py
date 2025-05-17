from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from MallAPI.permissions import IsDeliveryUser
from MallAPI.services.delivery_services import DeliveryService
from MallAPI.serializers.delivery_serializers import DeliveryOrderSerializer
from MallAPI.models.delivery_model import DeliveryOrder
from MallAPI.permissions import IsNormalUser
from MallAPI.utils import format_error_message

class DeliveryOrderView(APIView):
    permission_classes = [IsAuthenticated, IsDeliveryUser]
    
    def get(self, request):
        """Get active orders assigned to delivery user"""
        try:
            orders = DeliveryService.get_delivery_user_orders(request.user)
            if not orders.exists():
                return Response({
                    "status": "info",
                    "message": "No active orders assigned"
                }, status=status.HTTP_200_OK)
                
            serializer = DeliveryOrderSerializer(
                orders, 
                many=True,
                context={'request': request}
            )
            return Response({
                "status": "success",
                "orders": serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                "Details": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, delivery_id):
        """Update delivery status"""
        try:
            new_status = request.data.get('status')
            if not new_status:
                return Response(
                    {"Details": "Status is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            delivery = DeliveryService.update_delivery_status(
                delivery_id=delivery_id,
                status=new_status,
                user=request.user
            )
            
            serializer = DeliveryOrderSerializer(delivery)
            return Response({
                "status": "success",
                "message": f"Delivery status updated to {new_status}",
                "delivery": serializer.data
            })
            
        except ValueError as e:
            return Response({
                "Details": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class DeliveryHistoryView(APIView):
    permission_classes = [IsAuthenticated, IsDeliveryUser]
    
    def get(self, request):
        """Get delivery history"""
        try:
            orders = DeliveryService.get_delivery_user_history(request.user)
            serializer = DeliveryOrderSerializer(orders, many=True)
            return Response({
                "status": "success",
                "history": serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                "status": "error",
                "message": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class DeliveryView(APIView):
    permission_classes = [IsAuthenticated, IsNormalUser]

    def get(self, request):
        try:
            delivery = DeliveryOrder.objects.get(user=request.user)
            serializer = DeliveryOrderSerializer(delivery)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except DeliveryOrder.DoesNotExist:
            return Response(format_error_message("Delivery order not found"), status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(format_error_message(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            serializer = DeliveryOrderSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            # Get the first error message
            error_msg = next(iter(serializer.errors.values()))[0]
            return Response(format_error_message(error_msg), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(format_error_message(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request):
        try:
            delivery = DeliveryOrder.objects.get(user=request.user)
            serializer = DeliveryOrderSerializer(delivery, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            # Get the first error message
            error_msg = next(iter(serializer.errors.values()))[0]
            return Response(format_error_message(error_msg), status=status.HTTP_400_BAD_REQUEST)
        except DeliveryOrder.DoesNotExist:
            return Response(format_error_message("Delivery order not found"), status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(format_error_message(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request):
        try:
            delivery = DeliveryOrder.objects.get(user=request.user)
            delivery.delete()
            return Response({"message": "Delivery order deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except DeliveryOrder.DoesNotExist:
            return Response(format_error_message("Delivery order not found"), status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(format_error_message(str(e)), status=status.HTTP_500_INTERNAL_SERVER_ERROR) 