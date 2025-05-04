from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)
    username = models.CharField(_('username'), max_length=150, blank=True, null=True)
    is_merchant = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        db_table = 'bnpl_user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.email} ({'Merchant' if self.is_merchant else 'User'})"

    def get_username(self):
        return self.email

class PaymentPlan(models.Model):
    merchant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_plans')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    number_of_installments = models.PositiveIntegerField()
    user_email = models.EmailField()
    start_date = models.DateField()
    status = models.CharField(max_length=20, default='Active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"PaymentPlan({self.user_email}, {self.total_amount}, {self.number_of_installments})"

class Installment(models.Model):
    payment_plan = models.ForeignKey(PaymentPlan, related_name='installments', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    status = models.CharField(max_length=20, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Installment({self.payment_plan.id}, {self.amount}, {self.status})"

    def check_overdue(self):
        if self.status == 'Pending' and self.due_date < timezone.now().date():
            self.status = 'Late'
            self.save()
            return True
        return False

    def save(self, *args, **kwargs):
        if self.pk:  # Only check for existing instances
            self.check_overdue()
        super().save(*args, **kwargs)