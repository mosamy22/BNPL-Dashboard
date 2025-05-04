from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import Installment
from datetime import timedelta
from django.utils import timezone

@shared_task
def send_payment_reminder(installment_id):
    try:
        installment = Installment.objects.get(id=installment_id)
        if installment.status in ['Pending', 'Late']:
            days_until_due = (installment.due_date - timezone.now().date()).days
            if days_until_due <= 3 and days_until_due >= 0:
                subject = f'Payment Reminder: Installment Due in {days_until_due} days'
                message = f'''
                Dear Customer,
                
                This is a reminder that your installment of {installment.amount} ريال is due in {days_until_due} days.
                Due Date: {installment.due_date}
                
                Please make sure to complete the payment before the due date to avoid any late fees.
                
                Best regards,
                BNPL Team
                '''
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [installment.payment_plan.user_email],
                    fail_silently=False,
                )
    except Installment.DoesNotExist:
        pass

@shared_task
def check_overdue_installments():
    today = timezone.now().date()
    overdue_installments = Installment.objects.filter(
        status='Pending',
        due_date__lt=today
    )
    
    for installment in overdue_installments:
        installment.status = 'Late'
        installment.save()
        
        # Send overdue notification
        subject = 'Overdue Payment Notification'
        message = f'''
        Dear Customer,
        
        This is to inform you that your installment of {installment.amount} ريال is overdue.
        Due Date: {installment.due_date}
        
        Please make the payment as soon as possible to avoid any additional charges.
        
        Best regards,
        BNPL Team
        '''
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [installment.payment_plan.user_email],
            fail_silently=False,
        ) 