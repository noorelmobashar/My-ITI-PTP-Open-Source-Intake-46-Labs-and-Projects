public class EBook extends Book{

    public EBook(String title) {
        super(title);
    }

    @Override
    protected void performBorrow(User user) {
        System.out.println( user.getName()+" borrowed the e-book: "+super.getTitle() );

    }
}
