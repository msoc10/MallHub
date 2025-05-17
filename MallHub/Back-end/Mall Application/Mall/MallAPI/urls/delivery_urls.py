from django.urls import path
from MallAPI.views.delivery_views import DeliveryOrderView, DeliveryHistoryView

urlpatterns = [
    path('orders/', DeliveryOrderView.as_view(), name='delivery-orders'),
    path('orders/<int:delivery_id>/status/', DeliveryOrderView.as_view(), name='update-delivery-status'),
    path('history/', DeliveryHistoryView.as_view(), name='delivery-history'),
] 