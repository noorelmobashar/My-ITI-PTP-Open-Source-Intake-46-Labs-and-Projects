public class Book implements BookInterface{
    private String title;
    private boolean isAvailable;

    public Book(String title) {
        this.title = title;
        this.isAvailable = true;
    }

    public boolean isAvailable() {
        return isAvailable;
    }
    public String getTitle() {
        return title;
    }
    public final void borrowBook(User user) {
        if (isAvailable) {
            isAvailable = false;
            performBorrow(user);
        } else {
            System.out.println(title + " is not available.");
        }
    }

    protected void performBorrow(User user) {
        System.out.println(user.getName()+" "+title + " has been borrowed.");
    }

    public void returnBook() {
        isAvailable = true;
        System.out.println(title + " has been returned.");
    }


}
