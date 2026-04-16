from books.models import Book
from rest_framework import serializers
from authors.models import Author


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name']


class BookSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(read_only=True)
    authors = AuthorSerializer(many=True, read_only=True)
    

    class Meta:
        model = Book
        fields = '__all__'

    def validate_id(self, value):
        book = Book.objects.filter(id=value).first()
        if book:
            raise serializers.ValidationError('Book with this id already exists')
        return value
    
    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError('Price must be a positive number')
        return value
    
    def validate_no_of_page(self, value):
        if value < 1:
            raise serializers.ValidationError('Number of pages must be at least 1')
        return value
    
    def validate_title(self, value):
        if Book.objects.filter(title=value).exists():
            raise serializers.ValidationError('Book with this title already exists')
        return value
    
    def validate_brief(self, value):
        if len(value) < 10:
            raise serializers.ValidationError('Brief must be at least 10 characters long')
        return value
    
    def validate_authors(self, value):
        for author in value:
            if not Author.objects.filter(id=author['id']).exists():
                raise serializers.ValidationError(f"Author with id {author['id']} does not exist")
        return value
    
    def validate_image(self, value):
        if value and not value.name.lower().endswith(('.jpg', '.jpeg', '.png')):
            raise serializers.ValidationError('Image must be a JPG or PNG file')
        if value and value.size > 2 * 1024 * 1024:  # 2MB limit
            raise serializers.ValidationError('Image size must be less than 2MB')
        return value
    
    def create(self, validated_data):
        book = Book.objects.create(**validated_data)
        authors_data = self.initial_data.get('authors', [])
        for author_data in authors_data:
            author = Author.objects.get(pk=int(author_data['id']))
            book.authors.add(author)
        return book
    
