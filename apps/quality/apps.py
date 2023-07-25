from django.apps import AppConfig


class Config(AppConfig):
    name = 'apps.quality'
    label = 'a4_candy_quality'

    def ready(self):
        import apps.quality.signals  # noqa:F401
