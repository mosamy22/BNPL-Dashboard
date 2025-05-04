from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q
import logging

logger = logging.getLogger(__name__)

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        logger.info(f"Login attempt for email: {username}")
        
        try:
            # Try to fetch the user by email
            user = UserModel.objects.get(Q(email__iexact=username))
            logger.info(f"User found: {user.email}")
            
            # Check if the user is active
            if not user.is_active:
                logger.warning(f"User account is inactive: {user.email}")
                return None
                
            # Check password
            if user.check_password(password):
                logger.info(f"Authentication successful for user: {user.email}")
                return user
            else:
                logger.warning(f"Invalid password for user: {user.email}")
                return None
                
        except UserModel.DoesNotExist:
            logger.warning(f"No user found with email: {username}")
            # Run the default password hasher once to reduce timing differences
            UserModel().set_password(password)
            return None

    def get_user(self, user_id):
        UserModel = get_user_model()
        try:
            user = UserModel.objects.get(pk=user_id)
            logger.info(f"Retrieved user by ID: {user.email}")
            return user
        except UserModel.DoesNotExist:
            logger.warning(f"No user found with ID: {user_id}")
            return None 