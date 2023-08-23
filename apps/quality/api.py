from rest_framework import mixins
from rest_framework import viewsets

from adhocracy4.api.mixins import CommentMixin
from adhocracy4.api.permissions import ViewSetRulesPermission
from adhocracy4.comments_async import api as a4_api
from apps.quality.models import Quality
#from apps.quality.serializers import ModeratorCommentFeedbackSerializer
#from apps.quality.serializers import ThreadListSerializer
#from apps.quality.serializers import ThreadSerializer

class QualityViewSet(
    CommentMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = QualitySerializer
    permission_classes = (ViewSetRulesPermission,)

    def get_permission_object(self):
        return self.comment

    def get_queryset(self):
        return ModeratorCommentFeedback.objects.filter(comment=self.comment)


class QualityViewSet(a4_api.CommentViewSet):
    def get_serializer_class(self):
        if self.action == "list":
            return ThreadListSerializer
        return ThreadSerializer
