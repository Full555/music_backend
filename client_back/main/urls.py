from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import test_page

router = DefaultRouter()

urlpatterns = [
     path('api/', include('api.urls')),
     path('', include(router.urls)),
     path("test/", test_page),
]

