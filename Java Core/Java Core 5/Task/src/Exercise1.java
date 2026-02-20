import javax.swing.JPanel;
import javax.swing.JFrame;
import java.awt.*;
import java.util.Date;


public class Exercise1 {
    public static void main(String[] args) {
        MyPanel panel = new MyPanel();
        JFrame window = new JFrame();
        window.setContentPane(panel);
        window.setTitle("Hello World Frame");
        window.setSize(500, 500);
        window.setVisible(true);
    }
    static class MyPanel extends JPanel implements Runnable{
        MyPanel(){
            this.setBackground(Color.cyan);
            new Thread(this).start();
        }
        @Override
        public void run()
        {
            while(true) {
                try {
                    Thread.sleep(1000);
                    this.repaint();
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        }

        @Override
        public void paintComponent(Graphics g)
        {
            super.paintComponent(g);
            g.drawString(new Date().toLocaleString(), 100, 100);
        }
    }
}