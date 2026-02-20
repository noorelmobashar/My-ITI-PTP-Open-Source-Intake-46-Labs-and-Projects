import javax.swing.JPanel;
import javax.swing.JFrame;
import java.awt.*;

public class Exercise2 {

    public static void main(String[] args) {
        MyPanel panel = new MyPanel();
        JFrame window = new JFrame();
        window.setContentPane(panel);
        window.setTitle("Marquee Scroll Frame");
        window.setSize(800, 200); // Made it wider to see the scroll better
        window.setVisible(true);
    }

    static class MyPanel extends JPanel implements Runnable {
        private int xCoordinate = 800;
        private String message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non purus vel lacus efficitur sodales nec ac leo. Morbi a fringilla sem. Integer justo orci, finibus hendrerit pretium vitae, viverra vitae lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu ipsum sit amet arcu consequat efficitur accumsan nec ex. Ut suscipit varius nulla, at aliquet libero consectetur id. Nulla id ante non leo hendrerit tempus pretium quis elit. Morbi eleifend odio volutpat, auctor felis ut, hendrerit diam.\n" +
                "\n" +
                "Donec aliquam sed justo ac aliquam. Cras id mi sem. Cras molestie vehicula laoreet. In molestie dui non libero cursus elementum a nec eros. Etiam vel nibh vel magna porttitor commodo vel eu lectus. Morbi nisi mauris, dapibus dictum mollis a, pretium id tortor. Curabitur posuere varius pretium. Cras eget diam consectetur, dapibus mauris condimentum, varius risus. Duis tristique nisi at risus consectetur ornare.\n" +
                "\n" +
                "Sed tempor metus sit amet viverra venenatis. Nulla a arcu vitae nisi euismod gravida. Curabitur bibendum aliquet diam id fringilla. Etiam mattis augue ipsum, vitae tempor dui aliquam ac. Donec vehicula ac ligula sodales laoreet. Ut posuere risus diam, ut convallis lacus rutrum consectetur. Aenean condimentum nulla sed libero hendrerit, vel cursus quam faucibus. Proin sit amet odio eu mi venenatis tristique. Sed a leo et orci vehicula imperdiet luctus quis metus. Curabitur consequat mi augue, vitae placerat metus facilisis vitae. Nunc at ligula lectus. Curabitur id iaculis nisl, eu rhoncus magna. Pellentesque rhoncus cursus neque id viverra. Pellentesque sit amet erat tincidunt, vehicula urna sed, aliquet tortor. Donec dolor risus, faucibus sit amet libero vel, condimentum lobortis ante.\n" +
                "\n" +
                "Pellentesque sed nisi eros. Morbi sit amet arcu lectus. Integer ut varius purus. Donec vehicula metus non nunc condimentum fringilla quis at lacus. Maecenas in tortor at velit tempus consequat id et sem. Maecenas mollis tincidunt sapien a ultricies. Praesent vel elementum neque, consequat lacinia felis. Morbi lobortis dignissim dolor non commodo. Etiam eu nulla lacus. Vivamus laoreet purus id elit vestibulum, quis aliquam felis tristique.";

        MyPanel() {
            this.setBackground(Color.BLACK);
            new Thread(this).start();
        }

        @Override
        public void run() {
            while (true) {
                try {
                    xCoordinate -= 2;

                    if (xCoordinate < -900) {
                        xCoordinate = this.getWidth();
                    }

                    this.repaint();
                    Thread.sleep(20);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        }

        @Override
        public void paintComponent(Graphics g) {
            super.paintComponent(g);
            g.setFont(new Font("Arial", Font.BOLD, 24));
            g.setColor(Color.WHITE);

            g.drawString(message, xCoordinate, 100);
        }
    }
}