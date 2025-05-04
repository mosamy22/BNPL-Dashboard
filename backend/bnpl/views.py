from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Sum, Count, Q
from django.contrib.auth import authenticate
from .models import PaymentPlan, Installment, User
from .serializers import PaymentPlanSerializer, InstallmentSerializer
from .permissions import IsOwnerOrMerchant, IsPlanOwner
import logging
from django.http import Http404
from rest_framework.decorators import action

logger = logging.getLogger(__name__)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        logger.info(f"Login attempt for email: {email}")

        if not email or not password:
            logger.warning("Missing email or password")
            return Response(
                {'error': 'Please provide both email and password'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Authenticate using email
        user = authenticate(request, username=email, password=password)
        
        if user is None:
            logger.warning(f"Authentication failed for user: {email}")
            return Response(
                {'error': 'Invalid email or password'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            logger.warning(f"User account is inactive: {email}")
            return Response(
                {'error': 'Account is disabled'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        logger.info(f"Login successful for user: {email}")
        refresh = RefreshToken.for_user(user)
        return Response({
            'token': str(refresh.access_token),
            'is_merchant': user.is_merchant
        })

class PaymentPlanViewSet(viewsets.ModelViewSet):
    queryset = PaymentPlan.objects.all()
    serializer_class = PaymentPlanSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrMerchant]

    def get_queryset(self):
        if self.request.user.is_merchant:
            return PaymentPlan.objects.filter(merchant=self.request.user)
        return PaymentPlan.objects.filter(user_email=self.request.user.email)

    def create(self, request, *args, **kwargs):
        if not request.user.is_merchant:
            return Response(
                {'error': 'Only merchants can create payment plans'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(merchant=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class InstallmentViewSet(viewsets.ModelViewSet):
    queryset = Installment.objects.all()
    serializer_class = InstallmentSerializer
    permission_classes = [IsAuthenticated, IsPlanOwner]

    def get_queryset(self):
        if self.request.user.is_merchant:
            return Installment.objects.filter(payment_plan__merchant=self.request.user)
        return Installment.objects.filter(payment_plan__user_email=self.request.user.email)

    def get_object(self):
        pk = self.kwargs.get('pk')
        try:
            return Installment.objects.get(pk=pk)
        except Installment.DoesNotExist:
            raise Http404

    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        try:
            installment = self.get_object()
            if installment.status == 'Paid':
                return Response(
                    {"detail": "Installment already paid."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            installment.status = 'Paid'
            installment.save()
            return Response({"detail": "Installment marked as paid."})
        except Http404:
            return Response(
                {"detail": "Installment not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )

class MerchantAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_merchant:
            return Response(
                {"detail": "Only merchants can access analytics."}, 
                status=status.HTTP_403_FORBIDDEN
            )

        plans = PaymentPlan.objects.filter(merchant=request.user)
        total_revenue = plans.aggregate(total=Sum('total_amount'))['total'] or 0
        active_plans = plans.filter(status='Active').count()
        paid_plans = plans.filter(status='Paid').count()
        overdue_installments = Installment.objects.filter(
            payment_plan__in=plans,
            status='Late'
        ).count()
        total_plans = plans.count()
        success_rate = (paid_plans / total_plans * 100) if total_plans > 0 else 0
        recent_plans = plans.order_by('-created_at')[:5]
        recent_plans_data = PaymentPlanSerializer(recent_plans, many=True).data
        
        return Response({
            'total_revenue': total_revenue,
            'active_plans': active_plans,
            'paid_plans': paid_plans,
            'overdue_installments': overdue_installments,
            'success_rate': success_rate,
            'recent_plans': recent_plans_data
        })