import java.util.ArrayList;

interface Shape {
    void Draw();
}

class Rectangle implements Shape {
    @Override
    public void Draw() {

    }
}

class Circle implements Shape {
    @Override
    public void Draw() {

    }
}

class TestClass {
    public void apply(ArrayList<Shape> s) {
        System.out.println("Done");
    }
}

public class Exercise3 {
    public static void main(String[] args)
    {
        ArrayList<Shape> s = new ArrayList<Shape>();
        for(int i = 0;i < 5;i++) {
            Shape newS = new Rectangle();
            s.add(newS);
        }
        for(int i = 0;i < 5;i++)
        {
            Shape newS = new Circle();
            s.add(newS);
        }
        TestClass test = new TestClass();
        test.apply(s);
    }
}
