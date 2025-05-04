from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Installment, PaymentPlan
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Installment)
def update_payment_plan_status(sender, instance, **kwargs):
    """
    Signal handler to update PaymentPlan status when all installments are paid.
    """
    payment_plan = instance.payment_plan
    
    # Count total installments and paid installments
    total_installments = payment_plan.installments.count()
    paid_installments = payment_plan.installments.filter(status='Paid').count()
    
    logger.info(f"Payment Plan {payment_plan.id}: Total installments: {total_installments}, Paid installments: {paid_installments}")
    
    # Update payment plan status if all installments are paid
    if total_installments > 0 and total_installments == paid_installments:
        logger.info(f"All installments paid for Payment Plan {payment_plan.id}. Updating status to 'Paid'")
        payment_plan.status = 'Paid'
        payment_plan.save(update_fields=['status'])
    else:
        logger.info(f"Payment Plan {payment_plan.id} still has pending installments. Status remains unchanged.")