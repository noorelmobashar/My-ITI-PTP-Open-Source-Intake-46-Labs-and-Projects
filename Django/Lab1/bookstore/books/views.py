from django.shortcuts import get_object_or_404, redirect, render
from django.views import View

from .forms import BookForm
from .models import Book
# Create your views here.
#(id,title, breif, image, no_of_page , price)


class BookListView(View):
    def get(self, request):
        books = Book.objects.all()
        return render(request, 'books/index.html', context={'books': books})


class BookCreateView(View):
    def get(self, request):
        form = BookForm()
        return render(request, 'books/create.html', {'form': form})

    def post(self, request):
        form = BookForm(request.POST, request.FILES)
        if form.is_valid():
            book = form.save()
            return redirect('books.show', id=book.id)
        return render(request, 'books/create.html', {'form': form})


class BookEditView(View):
    def get(self, request, id):
        book = get_object_or_404(Book, id=id)
        form = BookForm(instance=book)
        return render(request, 'books/edit.html', {'form': form, 'book': book})

    def post(self, request, id):
        book = get_object_or_404(Book, id=id)
        form = BookForm(request.POST, request.FILES, instance=book)
        if form.is_valid():
            updated_book = form.save()
            return redirect('books.show', id=updated_book.id)
        return render(request, 'books/edit.html', {'form': form, 'book': book})

class BookDetailView(View):
    def get(self, request, id):
        book = get_object_or_404(Book, id=id)
        return render(request, 'books/show.html', {'book': book})


class BookDeleteView(View):
    def post(self, request, id):
        book = get_object_or_404(Book, id=id)
        book.delete()
        return redirect('books.index')