from django.apps import AppConfig


class BnplConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'bnpl'

    def ready(self):
        # Import signals to register them
        import bnpl.signals