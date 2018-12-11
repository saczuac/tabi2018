from django.conf.urls import url, include

from rest_framework.routers import DefaultRouter

from .api import PollViewSet, UniversityViewSet

router = DefaultRouter()
router.register(r'', PollViewSet)

another_router = DefaultRouter()
another_router.register(r'', UniversityViewSet)

polls_urls = [
    url(r'^universities/', include(another_router.urls)),
    url(r'^', include(router.urls)),
]
