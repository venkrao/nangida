from django.urls import path


from .views import *

urlpatterns = [
    path('trees/', TreeEndpoint.as_view()),
    path('trees/photos/infinite/', TreePhotosAllEndpoint.as_view()),
    path('tree/<tree_id>/', TreePhotoEndpoint.as_view()),
]