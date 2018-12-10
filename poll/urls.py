from django.conf.urls import url, include

from rest_framework.routers import DefaultRouter

from .api import PollViewSet

router = DefaultRouter()
router.register(r'', PollViewSet)

polls_urls = [
    url(r'^', include(router.urls)),
]
