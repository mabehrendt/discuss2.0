from django.apps import AppConfig


class Config(AppConfig):
    name = 'apps.stance'
    label = 'a4_candy_stance'

    def ready(self):
        import apps.stance.signals  # noqa:F401
