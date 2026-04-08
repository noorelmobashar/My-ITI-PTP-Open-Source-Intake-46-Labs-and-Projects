from django.urls import path
from books import views
urlpatterns = [
    path('', views.index, name='books.index'),
    path('<int:id>', views.show, name='books.show'),
]
