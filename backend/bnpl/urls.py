from django.urls import path
from .views import (
    LoginView,
    PaymentPlanViewSet,
    InstallmentViewSet,
    MerchantAnalyticsView
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('plans/', PaymentPlanViewSet.as_view({'get': 'list', 'post': 'create'}), name='paymentplan-list'),
    path('plans/<int:pk>/', PaymentPlanViewSet.as_view({'get': 'retrieve'}), name='paymentplan-detail'),
    path('installments/', InstallmentViewSet.as_view({'get': 'list'}), name='installment-list'),
    path('installments/<int:pk>/', InstallmentViewSet.as_view({'get': 'retrieve'}), name='installment-detail'),
    path('installments/<int:pk>/pay/', InstallmentViewSet.as_view({'post': 'pay'}), name='pay-installment'),
    path('analytics/', MerchantAnalyticsView.as_view(), name='merchant-analytics'),
]