from adhocracy4.api.mixins import ContentTypeMixin
from rest_framework import mixins
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse
from django.contrib.contenttypes.models import ContentType
from rest_framework.parsers import JSONParser
from apps.stance.models import UserStance, Stance
from apps.stance.serializers import UserStanceSerializer, UsedStanceSerializer, StanceSerializer

class UsedStanceViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    ContentTypeMixin,
    viewsets.GenericViewSet,
):
    def usedstance_list(request, ct_id, object_pk):
        pass


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

        if request.method == "GET":
            userstances = UserStance.objects.filter(content_type=ct_id,
                                                    object_id=object_pk)
            serializer = UserStanceSerializer(userstances, many=True)
            response = JsonResponse(serializer.data, safe=False)

            return response

        elif request.method == 'PATCH':
            data = JSONParser().parse(request)
            print(data['payload'])
            print(data['creator_id'])
            userstances_filtered = UserStance.objects.filter(content_type=ct_id,
                                                    object_id=object_pk, creator_id=data['creator_id']).first()

            print(userstances_filtered)
            serializer = UserStanceSerializer(userstances_filtered, data=data['payload'], partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            print(serializer.errors)
            return JsonResponse(serializer.errors, status=400)

        elif request.method == 'POST':
            data = JSONParser().parse(request)
            print("DATA: ", data)
            serializer = UserStanceSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                print(serializer.data)

                return JsonResponse(serializer.data, status=201)
            print(serializer.errors)

            return JsonResponse(serializer.errors, status=400)

class StanceViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    ContentTypeMixin,
    viewsets.GenericViewSet,
):
    def stance_list(request, ct_id, object_pk):
        if request.method == "GET":
            stances = Stance.objects.filter(content_type=ct_id, object_id=object_pk)
            serializer = StanceSerializer(stances, many=True)
            response = JsonResponse(serializer.data, safe=False)

            return response
        
        elif request.method == "DELETE":
            print("REQUEST DATA", request.path.split("/")[-2])
            id = request.path.split("/")[-2]
            stances = Stance.objects.filter(content_type=ct_id, object_id=object_pk, comment_id=id)
            stances.delete()
            return HttpResponse(status=204)
