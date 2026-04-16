from django.contrib import admin
from .models import Book


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
	list_display = ('title', 'price', 'no_of_page', 'created_at', 'updated_at')
	list_filter = ('created_at', 'updated_at')
	search_fields = ('title', 'brief')
	ordering = ('-updated_at',)