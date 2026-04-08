from django.urls import path
from authors import views
urlpatterns = [
    path('', views.index, name='authors.index'),
]
