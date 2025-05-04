from django.test import TestCase
from .models import PaymentPlan, Installment
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

class PaymentPlanTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.plan_data = {
            'total_amount': 1000,
            'number_of_installments': 4,
            'user_email': 'user@example.com',
            'start_date': '2024-06-01'
        }
        self.plan = PaymentPlan.objects.create(**self.plan_data)

    def test_create_payment_plan(self):
        response = self.client.post(reverse('paymentplan-list'), self.plan_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PaymentPlan.objects.count(), 2)

    def test_get_payment_plans(self):
        response = self.client.get(reverse('paymentplan-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_pay_installment(self):
        installment = Installment.objects.create(payment_plan=self.plan, amount=250, due_date='2024-07-01', status='Pending')
        response = self.client.post(reverse('pay-installment', args=[installment.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        installment.refresh_from_db()
        self.assertEqual(installment.status, 'Paid')

    def test_prevent_editing_paid_installment(self):
        installment = Installment.objects.create(payment_plan=self.plan, amount=250, due_date='2024-07-01', status='Paid')
        response = self.client.patch(reverse('installment-detail', args=[installment.id]), {'status': 'Pending'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_installment_validation(self):
        invalid_plan_data = {
            'total_amount': 1000,
            'number_of_installments': 3,
            'user_email': 'user@example.com',
            'start_date': '2024-06-01'
        }
        response = self.client.post(reverse('paymentplan-list'), invalid_plan_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)