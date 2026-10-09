import javax.swing.*;
import java.awt.*;

public class Ventana {

    public static void main(String[] args) {
        JFrame ventana = new JFrame("Ejemplo GridBagLayout");

        JPanel controlPanel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();

        JLabel etiqueta = new JLabel("Volumen:");
        JSlider slider = new JSlider(0, 100, 50);
        JSlider slider2 = new JSlider(0, 100, 50);
        JButton boton1 = new JButton("Aceptar");
        JButton boton2 = new JButton("Me quiero ir a casa coño que largo es esto");

        // Etiqueta: columna 0, fila 0
        gbc.gridx = 0;
        gbc.gridy = 0;
        controlPanel.add(boton1, gbc);

        // Slider: columna 1, fila 0
        gbc.gridx = 0;
        gbc.gridy = 0;
        controlPanel.add(slider, gbc);
    

        gbc.gridx = 0;
        gbc.gridx = 1;
        controlPanel.add(slider2, gbc);

        // Botón: columna 0, fila 1

        gbc.gridx = 0;
        gbc.gridy = 1;
        controlPanel.add(boton2, gbc);


        ventana.add(controlPanel);

        ventana.setSize(450, 200);
        ventana.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        ventana.setLocationRelativeTo(null);
        ventana.setVisible(true);
    }
}