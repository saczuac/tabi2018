# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from .models import Poll

from rest_framework import viewsets, permissions

from .serializers import PollSerializer

from django_filters import rest_framework


class PollViewSet(viewsets.ModelViewSet):
    queryset = Poll.objects.all()
    serializer_class = PollSerializer
    permission_classes = (permissions.IsAuthenticated,)

    filter_backends = (rest_framework.DjangoFilterBackend,)
    filter_fields = (
        'university_group__name',
        'university_school__name',
    )
