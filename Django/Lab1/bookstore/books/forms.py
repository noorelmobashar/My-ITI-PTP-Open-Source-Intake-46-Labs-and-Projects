from django import forms

from authors.models import Author
from .models import Book


class BookForm(forms.ModelForm):
    authors = forms.ModelMultipleChoiceField(
        queryset=Author.objects.all(),
        widget=forms.CheckboxSelectMultiple(),
        required=True,
    )

    class Meta:
        model = Book
        fields = ['title', 'brief', 'image', 'no_of_page', 'price', 'authors']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            self.fields['image'].required = False
            self.fields['authors'].initial = self.instance.authors.all()

    def clean_title(self):
        title = self.cleaned_data['title']
        queryset = Book.objects.filter(title=title)
        if self.instance and self.instance.pk:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise forms.ValidationError('A book with this title already exists.')
        return title
    
    def clean_brief(self):
        brief = self.cleaned_data['brief']
        if len(brief) < 10:
            raise forms.ValidationError('Brief must be at least 10 characters long.')
        return brief
    
    def clean_price(self):
        price = self.cleaned_data['price']
        if price <= 0:
            raise forms.ValidationError('Price must be a positive number.')
        return price
    
    def clean_no_of_page(self):
        no_of_page = self.cleaned_data['no_of_page']
        if no_of_page <= 0:
            raise forms.ValidationError('Number of pages must be a positive integer.')
        return no_of_page
    
    def clean_authors(self):
        authors = self.cleaned_data['authors']
        if not authors:
            raise forms.ValidationError('At least one author must be selected.')
        return authors
    
    def clean_image(self):
        image = self.cleaned_data['image']
        if image and image.size > 2 * 1024 * 1024:
            raise forms.ValidationError('Image file size must be less than 2MB.')
        return image