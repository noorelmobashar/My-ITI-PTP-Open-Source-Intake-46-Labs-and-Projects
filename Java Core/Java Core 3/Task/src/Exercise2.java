import java.util.function.Function;
class Quadratic implements Function<double[], double[]> {
    @Override
    public double[] apply(double[] co)
    {
        double a = co[0], b = co[1], c = co[2];
        double root1 = (-b + Math.sqrt(Math.pow(b, 2) - (4 * a * c))) / (2 * a);
        double root2 = (-b - Math.sqrt(Math.pow(b, 2) - (4 * a * c))) / (2 * a);
        return new double[]{root1, root2};
    }
}
public class Exercise2 {
    public static void main(String[] args) {
        // Example: Solve x^2 - 5x + 6 = 0 (a=1, b=-5, c=6)
        Quadratic n = new Quadratic();
        double[] results = n.apply(new double[]{1, -5, 6});
        System.out.println("Root 1: " + results[0]);
        System.out.println("Root 2: " + results[1]);
    }
}
