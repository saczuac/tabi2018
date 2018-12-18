# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from .models import Poll, UniversitySchool

from rest_framework import viewsets, permissions

from .serializers import PollSerializer, UniversitySerializer

from django_filters import rest_framework

from django.views.decorators.cache import cache_page

from django.utils.decorators import method_decorator


class PollViewSet(viewsets.ModelViewSet):
    queryset = Poll.objects.all()
    serializer_class = PollSerializer
    permission_classes = (permissions.IsAuthenticated,)

    filter_backends = (rest_framework.DjangoFilterBackend,)
    filter_fields = (
        'university_group__name',
        'university_school__name',
    )

    @method_decorator(cache_page(60 * 60 * 24 * 60))  # 2 Months Cache
    def dispatch(self, *args, **kwargs):
        return super(PollViewSet, self).dispatch(*args, **kwargs)


class UniversityViewSet(viewsets.ModelViewSet):
    queryset = UniversitySchool.objects.all()
    serializer_class = UniversitySerializer
    permission_classes = (permissions.IsAuthenticated,)
