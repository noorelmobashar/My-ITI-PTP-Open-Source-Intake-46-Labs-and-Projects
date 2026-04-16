import re

from django import forms

from .models import Author


class AuthorForm(forms.ModelForm):
    
    class Meta:
        model = Author
        fields = ['name', 'email', 'bio', 'gender']
        widgets = {
            'bio': forms.Textarea(attrs={'rows': 5}),
        }

    def clean_name(self):
        name = self.cleaned_data['name'].strip()
        if len(name) < 2:
            raise forms.ValidationError('Name must be at least 2 characters long.')

        if not re.fullmatch(r"[A-Za-z][A-Za-z .'-]*", name):
            raise forms.ValidationError('Name can contain letters, spaces, dots, hyphens, and apostrophes only.')

        return name
    
    def clean_email(self):
        email = self.cleaned_data['email'].strip()
        if Author.objects.filter(email=email).exclude(pk=self.instance.pk).exists():
            raise forms.ValidationError('An author with this email already exists.')
        return email
    
    def clean_bio(self):
        bio = self.cleaned_data['bio'].strip()
        if bio and len(bio) < 10:
            raise forms.ValidationError('Bio must be at least 10 characters long if provided.')
        return bio
    
    def clean_gender(self):
        gender = self.cleaned_data['gender']
        if gender not in ('M', 'F'):
            raise forms.ValidationError('Gender must be either "M" for  Male or "F" for Female.')
        return gender
