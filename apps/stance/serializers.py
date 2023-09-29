from rest_framework import serializers
from apps.stance.models import UserStance

class UserStanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStance
        fields = [
            'content_type', 'object_id', 'user_stance', 'creator', 'creator_id'
        ]
