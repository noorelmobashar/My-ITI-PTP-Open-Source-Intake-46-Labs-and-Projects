from django.db import models

# Create your models here.
class Book(models.Model):

    title = models.CharField(max_length=200, unique=True)
    brief = models.TextField()
    image = models.ImageField(upload_to='books/images/', null=True, blank=True)
    no_of_page = models.IntegerField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __str__(self):
        return self.title