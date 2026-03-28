public class Main {
    public static void main(String[] args) {

        LibraryService alexLibrary = LibraryService.getInstance();
        
        alexLibrary.addBook(new Book("Harry Potter"));
        alexLibrary.addBook(new PhysicalBook("Lord of the Rings"));
        alexLibrary.addBook(new EBook("Clean Code"));
        alexLibrary.addBook(new HistoricalBook("The History of Rome"));

        User user = new User("John", true);

        System.out.println("--- First Borrow Attempts ---");
        alexLibrary.borrowBook("Lord of the Rings", user);
        alexLibrary.borrowBook("Clean Code", user);
        
        System.out.println("\n--- Attempting to Borrow Already Borrowed Books ---");
        alexLibrary.borrowBook("Lord of the Rings", user);
        
        System.out.println("\n--- Returning Books ---");
        alexLibrary.returnBook("Lord of the Rings");
        
        System.out.println("\n--- Borrowing Returned Books ---");
        alexLibrary.borrowBook("Lord of the Rings", user);
        
    }
}
