from django.shortcuts import render

# Create your views here.
#(id,title, breif, image, no_of_page , price)

books = [
            {
                'id': 1,
                'title': 'The Great Gatsby',
                'brief': 'A novel by F. Scott Fitzgerald about the Jazz Age in the United States.',
                'image': 'books/images/gatsby.png',
                'no_of_page': 180,
                'price': 10.99,
                'author_id': 1
            },
            {
                'id': 2,
                'title': 'To Kill a Mockingbird',
                'brief': 'A novel by Harper Lee about racial injustice in the Deep South.',
                'image': 'books/images/to_kill_a_mockingbird.png',
                'no_of_page': 281,
                'price': 12.99,
                'author_id': 3
            },
            {
                'id': 3,
                'title': '1984',
                'brief': 'A dystopian novel by George Orwell about totalitarianism and surveillance.',
                'image': 'books/images/1984.png',
                'no_of_page': 328,
                'price': 9.99,
                'author_id': 2
            }
        ]
def index(request):
    return render(request, 'books/index.html',
                  context={'books': books})

def show(request, id):
    book = [*filter(lambda b: b['id'] == id, books)]
    if book:
        return render(request, 'books/show.html', {'book': book[0]})

    return render(request, 'not_found.html', status=404)