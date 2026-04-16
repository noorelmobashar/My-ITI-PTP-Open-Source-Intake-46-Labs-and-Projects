from django.db import models

# Create your models here.
class Author(models.Model):

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True)
    gender = models.CharField(choices=[('M', 'Male'), ('F', 'Female')], max_length=1)
    books = models.ManyToManyField('books.Book', related_name='authors')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name