import java.util.StringTokenizer;

public class Exercise1 {
    public static void main(String[] args) {
        String IP = "163.121.12.30";
        System.out.println("Using String.split()");
        System.out.println("The result is:");
        for (String number : IP.split("\\."))
        {
            System.out.println(number);
        }

        StringTokenizer IPTok = new StringTokenizer(IP, ".");
        System.out.println("Using StringTokenizer");
        System.out.println("The result is:");

        while(IPTok.hasMoreTokens())
        {
            System.out.println(IPTok.nextToken());
        }
    }
}