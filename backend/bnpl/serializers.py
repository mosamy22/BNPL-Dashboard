from rest_framework import serializers
from .models import PaymentPlan, Installment
from datetime import timedelta

class InstallmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Installment
        fields = ['id', 'payment_plan', 'amount', 'due_date', 'status']

class PaymentPlanSerializer(serializers.ModelSerializer):
    installments = InstallmentSerializer(many=True, read_only=True)
    merchant_email = serializers.SerializerMethodField()

    class Meta:
        model = PaymentPlan
        fields = ['id', 'total_amount', 'number_of_installments', 'start_date', 'user_email', 'merchant_email', 'status', 'installments']

    def get_merchant_email(self, obj):
        return obj.merchant.email

    def create(self, validated_data):
        number_of_installments = validated_data.get('number_of_installments')
        total_amount = validated_data.get('total_amount')
        
        if not number_of_installments or not total_amount:
            raise serializers.ValidationError("Both total_amount and number_of_installments are required.")
            
        installment_amount = total_amount / number_of_installments

        # Create the payment plan with all validated data
        payment_plan = PaymentPlan.objects.create(**validated_data)

        # Create installments
        for i in range(number_of_installments):
            Installment.objects.create(
                payment_plan=payment_plan,
                amount=installment_amount,
                due_date=payment_plan.start_date + timedelta(days=30 * i),
                status='Pending'
            )

        return payment_plan

    def validate(self, data):
        total_amount = data.get('total_amount')
        number_of_installments = data.get('number_of_installments')

        if total_amount is not None and number_of_installments is not None:
            if total_amount <= 0 or number_of_installments <= 0:
                raise serializers.ValidationError("Total amount and number of installments must be positive.")
        
        return data