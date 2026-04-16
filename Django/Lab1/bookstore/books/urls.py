from django.urls import path
from books import views
from .api.routers import router
urlpatterns = [
    path('', views.BookListView.as_view(), name='books.index'),
    path('create/', views.BookCreateView.as_view(), name='books.create'),
    path('edit/<int:id>/', views.BookEditView.as_view(), name='books.edit'),
    path('delete/<int:id>/', views.BookDeleteView.as_view(), name='books.delete'),
    path('<int:id>', views.BookDetailView.as_view(), name='books.show'),
] + router.urls
