import java.util.function.Function;

public class Exercise1 {
    public static void main(String[] args) {

        float x = 24;
        class InnerClase implements Function<Float, Float> {
            @Override
            public Float apply(Float t)
            {
                return t * 9/5 + 32;
            }
        }
        InnerClase in = new InnerClase();
        System.out.println(in.apply(x));
    }
}