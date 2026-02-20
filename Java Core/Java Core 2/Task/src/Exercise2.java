public class Exercise2 {
    public static void main(String[] args)
    {
        String sentence = "Hello Noor, Your name is Noor, right?";
        String word = "Noor";
        int occ1 = 0, occ2 = 0, ind = 0;

        occ1 = sentence.split(word).length - 1;
        System.out.println(occ1);

        while(true)
        {
            ind = sentence.indexOf(word, ind);
            if(ind == -1)
                break;
            ind += 4;
            occ2++;
        }
        System.out.println(occ2);
    }
}
