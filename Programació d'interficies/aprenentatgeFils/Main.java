

public class Main {
    public static void main(String[] args) {
        Thread hilo1 = new Thread(() -> {
            for (int i = 1; i <= 5; i++) {
                System.out.println("Hilo 1: " + i);
            }
        });

        Thread hilo2 = new Thread(() -> {
            for (int i = 1; i <= 5; i++) {
                System.out.println("Hilo 2: " + i);
            }
        });

        hilo1.start();
        hilo2.start();
    }
}