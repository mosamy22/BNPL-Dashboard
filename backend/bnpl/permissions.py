from rest_framework import permissions

class IsOwnerOrMerchant(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or merchants to access it.
    """
    def has_object_permission(self, request, view, obj):
        # Allow merchants to access all plans they created
        if request.user.is_merchant:
            return obj.merchant == request.user
        
        # Allow users to access only their own plans
        return obj.user_email == request.user.email

class IsPlanOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of a plan to access its installments.
    """
    def has_object_permission(self, request, view, obj):
        # Allow merchants to access installments of plans they created
        if request.user.is_merchant:
            return obj.payment_plan.merchant == request.user
        
        # Allow users to access installments of their own plans
        return obj.payment_plan.user_email == request.user.email 