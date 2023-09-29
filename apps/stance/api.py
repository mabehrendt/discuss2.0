from adhocracy4.api.mixins import ContentTypeMixin
from rest_framework import mixins
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse
from django.contrib.contenttypes.models import ContentType
from rest_framework.parsers import JSONParser
from apps.stance.models import UserStance
from apps.stance.serializers import UserStanceSerializer

class UserStanceViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    ContentTypeMixin,
    viewsets.GenericViewSet,
):
    def userstance_list(request, ct_id, object_pk):
        if request.method == 'POST':
            data = JSONParser().parse(request)
            print("DATA: ", data)
            print(ct_id)
            print(object_pk)
            serializer = UserStanceSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                print(serializer.data)
                return JsonResponse(serializer.data, status=201)
            print(serializer.errors)
            return JsonResponse(serializer.errors, status=400)
