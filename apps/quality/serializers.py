from rest_framework import serializers
from apps.quality.models import Quality
from apps.quality.models import UserQuality


class UserQualitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserQuality
        fields = [
            'content_type', 'object_id', 'guideline_shown', 'creator', 'creator_id'
        ]

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
