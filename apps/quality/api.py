
from adhocracy4.api.mixins import ContentTypeMixin
from rest_framework import mixins
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse
from django.contrib.contenttypes.models import ContentType
from rest_framework.parsers import JSONParser
from apps.quality.models import Quality
from apps.quality.serializers import QualitySerializer

class QualityViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    ContentTypeMixin,
    viewsets.GenericViewSet,
):
    @api_view(['GET'])
    def quality_list(request, ct_id, object_pk):
        """
        List all code snippets, or create a new snippet.
        """
        if request.method == 'GET':
            qualities = Quality.objects.filter(content_type=ct_id, object_id=object_pk)
            #print(qualities)
            #print(ct_id)
            #print(object_pk)
            #quality = ContentType.objects.get_for_id(ct_id).get_object_for_this_type(pk=object_pk)
            #qualities = list(quality.qualities.values("content_type", "object_id", "comment_text", "prediction", "quality","comment_id","creator"))
            #print(qualities)
            serializer = QualitySerializer(qualities, many=True)
            response = JsonResponse(serializer.data, safe=False)
            print("QUALITY API")
            print(serializer.data)
            #print(response)
            return response

        #elif request.method == 'POST':
        #    data = JSONParser().parse(request)
        #    serializer = QualitySerializer(data=data)
        #    if serializer.is_valid():
        #        serializer.save()
        #        return JsonResponse(serializer.data, status=201)
        #    return JsonResponse(serializer.errors, status=400)
