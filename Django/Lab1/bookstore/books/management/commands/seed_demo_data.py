from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand
from django.db import transaction

from authors.models import Author
from books.models import Book


class Command(BaseCommand):
    help = 'Populate the database with demo authors and books.'

    def handle(self, *args, **options):
        books_dir = Path(settings.BASE_DIR) / 'books' / 'static' / 'books' / 'images'

        authors_data = [
            {'name': 'J.K. Rowling', 'email': 'jk.rowling@example.com', 'bio': 'British author, best known for the Harry Potter series.', 'gender': 'Female'},
            {'name': 'George Orwell', 'email': 'george.orwell@example.com', 'bio': 'British author, best known for 1984 and Animal Farm.', 'gender': 'Male'},
            {'name': 'Harper Lee', 'email': 'harper.lee@example.com', 'bio': 'American author, best known for To Kill a Mockingbird.', 'gender': 'Female'},
        ]

        books_data = [
            {
                'title': 'The Great Gatsby',
                'brief': 'A novel by F. Scott Fitzgerald about the Jazz Age in the United States.',
                'image': books_dir / 'gatsby.png',
                'no_of_page': 180,
                'price': '10.99',
                'author_name': 'J.K. Rowling',
            },
            {
                'title': 'To Kill a Mockingbird',
                'brief': 'A novel by Harper Lee about racial injustice in the Deep South.',
                'image': books_dir / 'to_kill_a_mockingbird.png',
                'no_of_page': 281,
                'price': '12.99',
                'author_name': 'Harper Lee',
            },
            {
                'title': '1984',
                'brief': 'A dystopian novel by George Orwell about totalitarianism and surveillance.',
                'image': books_dir / '1984.png',
                'no_of_page': 328,
                'price': '9.99',
                'author_name': 'George Orwell',
            },
        ]

        with transaction.atomic():
            authors_by_name = {}
            for author_data in authors_data:
                gender_value = author_data['gender']
                if gender_value in ('Male', 'Female'):
                    gender_value = gender_value[0].upper()

                author, _ = Author.objects.update_or_create(
                    email=author_data['email'],
                    defaults={
                        'name': author_data['name'],
                        'bio': author_data['bio'],
                        'gender': gender_value,
                    },
                )
                authors_by_name[author.name] = author

            for book_data in books_data:
                book, created = Book.objects.update_or_create(
                    title=book_data['title'],
                    defaults={
                        'brief': book_data['brief'],
                        'no_of_page': book_data['no_of_page'],
                        'price': book_data['price'],
                    },
                )

                image_path = book_data['image']
                if image_path.exists():
                    with image_path.open('rb') as image_file:
                        book.image.save(image_path.name, File(image_file), save=False)

                book.save()
                book.authors.set([authors_by_name[book_data['author_name']]])

                action = 'Created' if created else 'Updated'
                self.stdout.write(self.style.SUCCESS(f'{action} book: {book.title}'))

        self.stdout.write(self.style.SUCCESS('Demo data is ready.'))