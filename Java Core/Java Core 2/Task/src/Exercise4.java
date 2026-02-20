public class Exercise4 {
    public static int BinarySearch(int[] numbers, int target)
    {
        int l = 0, r = numbers.length - 1, mid;
        while(l < r)
        {
            mid = (int)((l + r) / 2);
            if(numbers[mid] == target) return mid;
            if(numbers[mid] < target) l = mid + 1;
            else r = mid - 1;
        }
        return -1;
    }
    public static void main(String[] args)
    {
        int[] numbers = new int[10];
        for(int i = 0;i < 10;i++)numbers[i] = i;
        long time = System.currentTimeMillis();
        System.out.println("Searching for 8: ");
        int ind = BinarySearch(numbers, 8);
        if(ind != -1)
            System.out.println("Found at index " + ind);
        else
            System.out.println("Not Found");
        System.out.println("Time elapsed: " + (System.currentTimeMillis() - time) + "ms");
    }
}
