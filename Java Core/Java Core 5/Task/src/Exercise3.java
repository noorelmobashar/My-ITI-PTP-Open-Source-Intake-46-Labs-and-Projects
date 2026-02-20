import javax.swing.JPanel;
import javax.swing.JFrame;
import java.awt.*;

public class Exercise3 {

    public static void main(String[] args) {
        MyPanel panel = new MyPanel();
        JFrame window = new JFrame();
        window.setContentPane(panel);
        window.setTitle("Hello World Frame");
        window.setSize(500, 500);
        window.setVisible(true);
    }

    static class MyPanel extends JPanel implements Runnable {
        private int x = 100;
        private int y = 100;
        private int xVelocity = 4;
        private int yVelocity = 4;
        private int ballDiameter = 30;

        MyPanel() {
            this.setBackground(Color.cyan);
            new Thread(this).start();
        }

        @Override
        public void run() {
            while (true) {
                try {
                    x += xVelocity;
                    y += yVelocity;

                    if (x < 0 || x + ballDiameter > this.getWidth()) {
                        xVelocity = -xVelocity; // Reverse horizontal direction
                    }

                    if (y < 0 || y + ballDiameter > this.getHeight()) {
                        yVelocity = -yVelocity;
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
            g.setColor(Color.RED);
            g.fillOval(x, y, ballDiameter, ballDiameter);
        }
    }
}