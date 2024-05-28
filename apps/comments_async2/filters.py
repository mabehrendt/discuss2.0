from django.db import models
from itertools import chain
from rest_framework.filters import BaseFilterBackend
from rest_framework.filters import SearchFilter
from django.contrib.contenttypes.models import ContentType
import random
from apps.quality.models import Quality
from adhocracy4.comments.models import Comment

class CommentCategoryFilterBackend(BaseFilterBackend):
    """Filter the comments for the categories."""

    def filter_queryset(self, request, queryset, view):

        if "comment_category" in request.GET and request.GET["comment_category"] != "":
            category = request.GET["comment_category"]
            return queryset.filter(
                comment_categories__contains=category, is_blocked=False
            )

        return queryset


class CommentOrderingFilterBackend(BaseFilterBackend):
    """Order the comments."""

    def filter_queryset(self, request, queryset, view):
        if "ordering" in request.GET:
            ordering = request.GET["ordering"]

            if ordering == "new":
                return queryset.order_by("-created")
            elif ordering == "ans":
                queryset = queryset.annotate(
                    comment_count=models.Count("child_comments", distinct=True)
                )
                return queryset.order_by("-comment_count", "-created")
            elif ordering == "pos":
                queryset = queryset.annotate(
                    positive_rating_count=models.Count(
                        models.Case(
                            models.When(ratings__value=1, then=models.F("ratings__id")),
                            output_field=models.IntegerField(),
                        ),
                        distinct=True,
                    )
                )
                return queryset.order_by("-positive_rating_count", "-created")
            elif ordering == "neg":
                queryset = queryset.annotate(
                    negative_rating_count=models.Count(
                        models.Case(
                            models.When(
                                ratings__value=-1, then=models.F("ratings__id")
                            ),
                            output_field=models.IntegerField(),
                        ),
                        distinct=True,
                    )
                )
                return queryset.order_by("-negative_rating_count", "-created")
            elif ordering == "dis":
                return queryset.order_by(
                    models.F("last_discussed").desc(nulls_last=True), "-created"
                )
            elif ordering == "mom":
                return queryset.order_by("-is_moderator_marked", "-created")
            elif ordering == "qua":
                qualities = Quality.objects.filter(object_id=request.GET["objectPk"]).filter(
                    content_type_id=request.GET["contentTypeId"]
                )
                high_qualities = qualities.order_by('-prediction').filter(quality='high').order_by('-created')[:3]
                blocked_ids = high_qualities.values("id")
                qualities = qualities.order_by('-created')
                qualities = qualities.exclude(id__in=blocked_ids)
                print('High Qualities:', high_qualities.values_list("comment_id",flat=True))
                print('Qualities:', qualities.values_list("comment_id",flat=True))
                qualities_whole = list(chain(high_qualities.values_list("comment_id",flat=True),qualities.values_list("comment_id",flat=True)))
                queryset = Comment.objects.filter(id__in=qualities_whole)
            elif ordering == "ranqua":
                qualities = Quality.objects.filter(object_id=request.GET["objectPk"]).filter(
                    content_type_id=request.GET["contentTypeId"]
                )
                qualities = qualities.order_by('-created')
                quality_ids = qualities.values_list("comment_id", flat=True)
                if len(qualities) <= 3:
                    queryset = Comment.objects.filter(id__in=quality_ids)
                elif len(qualities) > 3:
                    rand_high_qualities = random.sample(list(qualities),3)
                    print(rand_high_qualities)
                    id_list = [rec.id for rec in rand_high_qualities]
                    high_qualities = Quality.objects.filter(id__in=id_list)
                    blocked_ids = high_qualities.values("id")
                    qualities = qualities.exclude(id__in=blocked_ids)
                    qualities_whole = list(chain(high_qualities.values_list("comment_id",flat=True),qualities.values_list("comment_id",flat=True)))
                    queryset = Comment.objects.filter(id__in=qualities_whole)
        return queryset


class CustomSearchFilter(SearchFilter):
    def filter_queryset(self, request, queryset, view):
        qs = super().filter_queryset(request, queryset, view)
        if self.get_search_terms(request):
            return qs.filter(is_removed=False, is_censored=False, is_blocked=False)
        return qs
