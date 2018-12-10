from django.contrib import admin
from django.urls import path, include

from poll.urls import polls_urls

from frontend.urls import frontend_urls

from rest_framework_swagger.views import get_swagger_view

schema_view = get_swagger_view(title='TABI API')

urlpatterns = [
    path('', include(frontend_urls)),
    path('api/', schema_view),
    path('api/polls/', include(polls_urls)),
    path('admin/', admin.site.urls),
]
