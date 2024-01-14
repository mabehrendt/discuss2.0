from django.apps import AppConfig
from ai.argument_adapters import QualityPredictor

class Config(AppConfig):
    name = 'apps.quality'
    label = 'a4_candy_quality'
    predictor = QualityPredictor()
    predictor.load_adapters()

    def ready(self):
        import apps.quality.signals  # noqa:F401
