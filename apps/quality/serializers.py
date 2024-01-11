from rest_framework import serializers
from apps.quality.models import Quality

class QualitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Quality
        fields = [
            'content_type',
            'object_id',
            'prediction',
            'quality',
            'comment_text',
            'comment_id',
            'creator',
            'created',
            'modified'

        ]
