from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from django.utils.translation import gettext_lazy as _
from .models import PaymentPlan, Installment, User

class InstallmentInline(admin.TabularInline):
    model = Installment
    extra = 0
    readonly_fields = ('created_at',)
    fields = ('amount', 'due_date', 'status', 'created_at')

class InstallmentAdmin(admin.ModelAdmin):
    list_display = ('payment_plan', 'amount', 'due_date', 'status', 'created_at')
    list_filter = ('status', 'due_date')
    search_fields = ('payment_plan__user_email', 'payment_plan__merchant__email')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)

class PaymentPlanAdmin(admin.ModelAdmin):
    list_display = ('total_amount', 'number_of_installments', 'status', 'created_at')
    inlines = [InstallmentInline]

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('email',)

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ('email', 'is_merchant', 'is_active', 'is_staff', 'is_superuser')

class UserAdmin(BaseUserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    
    list_display = ('email', 'is_merchant', 'is_active', 'is_staff', 'is_superuser')
    list_filter = ('is_merchant', 'is_active', 'is_staff', 'is_superuser')
    search_fields = ('email',)
    ordering = ('email',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Permissions'), {'fields': ('is_merchant', 'is_active', 'is_staff', 'is_superuser')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_merchant'),
        }),
    )

admin.site.register(PaymentPlan, PaymentPlanAdmin)
admin.site.register(Installment, InstallmentAdmin)
admin.site.register(User, UserAdmin)