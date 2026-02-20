interface Complex<T> {
    T getReal();
    T getImaginary();

    Complex<T> add(Complex<T> z);
    Complex<T> subtract(Complex<T> z);
    Complex<T> product(Complex<T> z);
    Complex<T> div(Complex<T> z);
}

class DoubleComplex implements Complex<Double> {
    private double r, i;
    DoubleComplex(double _r, double _i)
    {
        r = _r; i = _i;
    }
    public Double getReal()
    {
        return r;
    }
    public Double getImaginary()
    {
        return i;
    }

    public DoubleComplex add(Complex<Double> z)
    {
        return new DoubleComplex(r + z.getReal(), i + z.getImaginary());
    }
    public DoubleComplex subtract(Complex<Double> z)
    {
        return new DoubleComplex(r - z.getReal(), i - z.getImaginary());

    }
    public DoubleComplex product(Complex<Double> z)
    {
        return new DoubleComplex(r * z.getReal(), i * z.getImaginary());

    }
    public DoubleComplex div(Complex<Double> z)
    {
        return new DoubleComplex(r / z.getReal(), i / z.getImaginary());

    }
    public void print()
    {
        System.out.println(r + (i < 0 ? " " : " + ") + i + "j");
    }
}
public class Exercise4 {
    public static void main(String[] args)
    {
        DoubleComplex a = new DoubleComplex(5, 6);
        DoubleComplex b = new DoubleComplex(3, 1);

        DoubleComplex c = a.add(b);
        c.print();
    }
}
