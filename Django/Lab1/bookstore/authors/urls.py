from django.urls import path
from authors import views
urlpatterns = [
    path('', views.AuthorListView.as_view(), name='authors.index'),
    path('create/', views.AuthorCreateView.as_view(), name='authors.create'),
    path('<int:id>/', views.AuthorDetailView.as_view(), name='authors.show'),
    path('edit/<int:id>/', views.AuthorEditView.as_view(), name='authors.edit'),
    path('delete/<int:id>/', views.AuthorDeleteView.as_view(), name='authors.delete'),
]
