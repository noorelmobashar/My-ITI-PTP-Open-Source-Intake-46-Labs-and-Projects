public class Exercise2 {

    public static class NoorException extends Exception
    {
        public NoorException()
        {
            super("Noor Loves You");
        }
    }
    public static class A {
        public void Bark(int t) throws NoorException {
            if(t < 0)
                throw new NoorException();
            else {
                for (int i = 0; i < t; i++) {
                    System.out.println("HawHawHaw");
                }
            }
        }
        public void Meow(int t) throws NoorException {
            if(t < 0)
                throw new NoorException();
            else {
                for (int i = 0; i < t; i++) {
                    System.out.println("MeowMeowMeow");
                }
            }
        }
        public void Rrrr(int t) throws NoorException {
            if(t < 0)
                throw new NoorException();
            else {
                for (int i = 0; i < t; i++) {
                    System.out.println("RrrrRrrrRrrr");
                }
            }
        }
    }
    public static class B {
        A newA = new A();
        public void CallF()
        {
            try
            {
                newA.Bark(3);
                newA.Meow(-3);
                newA.Rrrr(2);
            }
            catch (NoorException e) {
                e.printStackTrace();
            }
        }
    }
    public static void main(String[] args)
    {
        B newB = new B();
        newB.CallF();
    }
}
