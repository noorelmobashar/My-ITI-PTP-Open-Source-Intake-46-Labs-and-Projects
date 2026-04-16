from django.contrib import admin
from .models import Author


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
	list_display = ('name', 'email', 'gender', 'created_at', 'updated_at')
	list_filter = ('gender', 'created_at', 'updated_at')
	search_fields = ('name', 'email', 'bio')
	filter_horizontal = ('books',)
	ordering = ('name',)