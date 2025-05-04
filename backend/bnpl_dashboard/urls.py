from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from bnpl.views import PaymentPlanViewSet, InstallmentViewSet, MerchantAnalyticsView, LoginView

router = DefaultRouter()
router.register(r'plans', PaymentPlanViewSet, basename='paymentplan')
router.register(r'installments', InstallmentViewSet, basename='installment')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/analytics/', MerchantAnalyticsView.as_view(), name='merchant-analytics'),
    path('api/login/', LoginView.as_view(), name='login'),
]