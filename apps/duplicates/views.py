from django.shortcuts import render
from django.http import HttpResponse

from adhocracy4.comments.models import Comment

from collections import defaultdict
from django.utils import timezone
from datetime import timedelta
# Create your views here.
def display_same_users(request):
    # Step 1: Get the current date
    today = timezone.now().date()

    # Step 2: Retrieve all comments for today
    comments = Comment.objects.filter(created__date=today)

    # Step 3: Use a nested dictionary to track occurrences of each comment text by user
    comment_dict = defaultdict(lambda: defaultdict(list))
    for comment in comments:
        cleaned_comment = comment.comment.strip().lower()
        user = comment.creator  # Assuming 'creator' is the field name for the user
        comment_dict[user][cleaned_comment].append(comment)

    # Step 4: Identify duplicate comments by the same user
    duplicates = []
    for user, user_comments in comment_dict.items():
        for comment_text, instances in user_comments.items():
            if len(instances) > 1:
                duplicate_details = [
                    {
                        'id': instance.id,
                        'created': instance.created,
                        'content_type': instance.content_type,
                        'object_pk': instance.object_pk
                    }
                    for instance in instances
                ]
                duplicates.append({
                    'user': user,
                    'text': comment_text,
                    'count': len(instances),
                    'instances': duplicate_details
                })

    context = {
        'duplicates': duplicates,
        'no_duplicates': len(duplicates) == 0
    }

    return render(request, 'check_duplicates_same.html', context)

# Create your views here.
def display_diff_users(request):
    # Step 1: Get the current date
    today = timezone.now().date()

    # Step 2: Retrieve all comments for today
    comments = Comment.objects.filter(created__date=today)

    # Step 3: Use a dictionary to track occurrences of each comment text and users
    comment_dict = defaultdict(set)
    for comment in comments:
        cleaned_comment = comment.comment.strip().lower()
        user = comment.creator  # Assuming 'creator' is the field name for the user
        comment_dict[cleaned_comment].add(user)

    # Step 4: Identify and prepare duplicate comments by different users
    duplicates = []
    for comment_text, users in comment_dict.items():
        if len(users) > 1:
            duplicate_instances = Comment.objects.filter(comment__iexact=comment_text, created__date=today)
            duplicate_details = [
                {
                    'id': instance.id,
                    'created': instance.created,
                    'user': instance.creator,
                    'content_type': instance.content_type,
                    'object_pk': instance.object_pk
                }
                for instance in duplicate_instances
            ]
            duplicates.append({
                'text': comment_text,
                'users_count': len(users),
                'instances': duplicate_details
            })

    context = {
        'duplicates': duplicates,
        'no_duplicates': len(duplicates) == 0
    }

    return render(request, 'check_duplicates_diff.html', context)


# Create your views here.
def display_all_users(request):
    # Step 1: Retrieve all comments
    comments = Comment.objects.all()

    # Step 2: Use a dictionary to track occurrences of each comment text
    comment_dict = defaultdict(list)
    for comment in comments:
        cleaned_comment = comment.comment.strip().lower()
        comment_dict[cleaned_comment].append(comment)

    # Step 3: Identify duplicate comments
    duplicates = []
    for comment_text, instances in comment_dict.items():
        if len(instances) > 1:
            duplicate_details = [
                {
                    'id': instance.id,
                    'created': instance.created,
                    'creator': instance.creator,
                    'content_type': instance.content_type,
                    'object_pk': instance.object_pk
                }
                for instance in instances
            ]
            duplicates.append({
                'text': comment_text,
                'count': len(instances),
                'instances': duplicate_details
            })

    context = {
        'duplicates': duplicates,
        'no_duplicates': len(duplicates) == 0
    }

    return render(request, 'check_duplicates_all.html', context)