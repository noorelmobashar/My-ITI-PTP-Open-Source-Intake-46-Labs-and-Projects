from django.shortcuts import render
from books.views import books
# Create your views here.

authors = [
    {
        'id': 1,
        'name': 'J.K. Rowling'
    },
    {
        'id': 2,
        'name': 'George Orwell'
    },
    {
        'id': 3,
        'name': 'Harper Lee'
    }
]

def index(request):
    return render(request, 'authors/index.html', context={'authors': authors, 'books': books})