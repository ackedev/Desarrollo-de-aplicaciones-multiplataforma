package src.model;

import java.awt.image.BufferedImage;

public class Model implements IModel, Runnable {
    private final int width = 320;
    private final int height = 200;
    private final int frameMS = 33;  // 30fps

    private final Fire fire;
    private final Render render;

    public Model() {
        fire = new Fire(width, height);
        render = new Render(fire, Palette.createPalette());
    }

    @Override
    public void start() {
        Thread thread = new Thread(this, "Model-Fire");// Modelo inciia el hilo
        thread.setDaemon(true);// El hilo se cierra al cerrar el program
        thread.start();// El hilo ejecuta

    }

    @Override
    public void run() {
        while (true) {
            update();
            try {
                Thread.sleep(frameMS);

            } catch (InterruptedException e) {
                return;
            }
        }
    }

    private synchronized void update() {
        fire.sparksGeneration();
        fire.coolPointsGeneration();
        fire.updateFlames();

    }
    
    @Override
    public BufferedImage getImage() {
        return render.getImage(fire);
    }

}
