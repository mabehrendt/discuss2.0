from rest_framework import serializers
from apps.stance.models import Stance, UserStance, UsedStance

class UserStanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStance
        fields = [
            'content_type', 'object_id', 'user_stance', 'questionbox_shown', 'questionbox_clicked', 'creator', 'creator_id'
        ]

class UsedStanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsedStance
        fields = [
            'content_type', 'object_id', 'comment_id', 'creator', 'creator_id'
        ]

class StanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stance
        fields = [
            'content_type', 'object_id', 'stance', 'comment_text', 'comment_id', 'creator'
        ]


