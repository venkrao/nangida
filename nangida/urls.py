"""nangida URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.urls import include, path
from django.views.decorators.csrf import csrf_exempt

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from graphene_django.views import GraphQLView
from graphene_file_upload.django import FileUploadGraphQLView
from graph.views import PrivateGraphQLView

from api.trees import urls


urlpatterns = [
    path("graphql/", csrf_exempt(FileUploadGraphQLView.as_view(graphiql=True))),
    path('v1/jwt-token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('v1/jwt-token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('v1/', include(urls)),
]
