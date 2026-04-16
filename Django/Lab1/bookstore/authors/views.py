from django.shortcuts import get_object_or_404, redirect, render
from django.views import View

from .forms import AuthorForm
from .models import Author


class AuthorListView(View):
    def get(self, request):
        authors = Author.objects.all()
        return render(request, 'authors/index.html', context={'authors': authors})


class AuthorCreateView(View):
    def get(self, request):
        form = AuthorForm()
        return render(request, 'authors/create.html', context={'form': form})

    def post(self, request):
        form = AuthorForm(request.POST)
        if form.is_valid():
            author = form.save()
            return redirect('authors.show', id=author.id)
        return render(request, 'authors/create.html', context={'form': form})


class AuthorDetailView(View):
    def get(self, request, id):
        author = get_object_or_404(Author, id=id)
        return render(request, 'authors/show.html', {'author': author})


class AuthorEditView(View):
    def get(self, request, id):
        author = get_object_or_404(Author, id=id)
        form = AuthorForm(instance=author)
        return render(request, 'authors/edit.html', context={'form': form, 'author': author})

    def post(self, request, id):
        author = get_object_or_404(Author, id=id)
        form = AuthorForm(request.POST, instance=author)
        if form.is_valid():
            updated_author = form.save()
            return redirect('authors.show', id=updated_author.id)
        return render(request, 'authors/edit.html', context={'form': form, 'author': author})


class AuthorDeleteView(View):
    def post(self, request, id):
        author = get_object_or_404(Author, id=id)
        author.delete()
        return redirect('authors.index')