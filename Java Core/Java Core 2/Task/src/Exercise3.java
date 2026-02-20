public class Exercise3 {
    public static void main(String[] args)
    {
        int[] numbers = new int[1000];
        for(int i = 0;i < 1000;i++)
        {
            numbers[i] = (int)(Math.random() * 1000);
        }

        long time = System.currentTimeMillis();
        int min = (int)Math.pow(2.0, 31.0), max = -(int)Math.pow(2.0, 31.0);
        for(int i = 0; i < 1000;i++)
        {
            if(min > numbers[i]) min = numbers[i];
            if(max < numbers[i]) max = numbers[i];
        }
        System.out.println("Minimum number is: " + min);
        System.out.println("Maximum number is: " + max);
        System.out.println("Time elapsed is: " + (System.currentTimeMillis() - time) + "ms");

    }
}
