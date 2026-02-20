interface Function<T, R> {
    public R apply(T degree);
}

class TemperatureConvert implements Function<Float, Float> {
    @Override
    public Float apply(Float degree) {
        return degree * 1.8f + 32;
    }
}
public class Exercise1 {
    public static void main(String[] args) {

        float x = 24;
        System.out.println("Temp is = " + x + "C or " + new TemperatureConvert().apply(x) + "F");
    }
}