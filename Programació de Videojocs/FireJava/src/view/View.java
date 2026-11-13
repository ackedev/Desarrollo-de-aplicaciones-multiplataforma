package src.view;

import java.awt.Dimension;
import java.awt.image.BufferedImage;

import javax.swing.JFrame;

import src.presenter.IPresenter;


public class View implements IView, Runnable {
    private final int FRAME_MS = 10;

    private IPresenter presenter;
    private final JFrame frame;
    private final Viewer viewer;

    public View() {
        viewer = new Viewer ();

        frame = new JFrame("Fire Animation");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.add(viewer); // Añadimos viewer a la ventana principal
    }


    @Override 
    public void setPresenter(IPresenter presenter){
        this.presenter = presenter;
    }

    @Override 
    public void start(){
        // La mida de la finestra es defineix gracies a: 
        BufferedImage first = presenter.getImage();

        //Usamos first para settear la ventana
        viewer.setPreferredSize(new Dimension(first.getWidth(), first.getHeight()));
        viewer.setImage(first);

        //Frame - Ventana principal
        frame.pack();
        frame.setVisible(true);

        //HIlos - iniciar hilo de view para renderizar    
        Thread thread = new Thread(this, "View-Fire");
        thread.setDaemon(true);
        thread.start();
    }

    @Override
    public void run(){
        while(true){
            viewer.setImage(presenter.getImage());
            
            try{
                Thread.sleep(FRAME_MS);

            } catch (InterruptedException e){
                return;
            }
        }
    }
}
