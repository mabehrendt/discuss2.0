from rest_framework import serializers

from apps.quality.models import Quality
from adhocracy4.comments_async import serializers as a4_serializers
from apps.contrib.dates import get_date_display
from apps.quality.models import Quality


from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.utils.translation import gettext as _
from easy_thumbnails.files import get_thumbnailer

from adhocracy4.api.dates import get_datetime_display


class QualitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Quality
        fields = [
            'content_type', 'object_id', 'prediction', 'quality', 'comment_text', 'comment_id', 'creator'
        ]
