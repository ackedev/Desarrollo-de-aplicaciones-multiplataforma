package src.view;

import java.awt.Canvas;
import java.awt.Graphics;
import java.awt.image.BufferedImage;


public class Viewer extends Canvas{
    private volatile BufferedImage image;

    public void setImage(BufferedImage image){
        this.image = image;
        repaint(); // Vuelve a dibujar -> Canvas
    }

    // Funciones que salen del canvas
    @Override 
    public void paint(Graphics g) {
        g.drawImage(image, 0, 0, getWidth(), getHeight(), null);

    }
    
    @Override 
    public void update(Graphics g){
        paint(g);
    }
}
