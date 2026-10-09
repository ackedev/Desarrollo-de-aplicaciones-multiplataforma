public class DosFilsSimultaneament {

    static class FilAmbThread extends Thread {
        @Override
        public void run() {
            for (int i = 0; i <= 20; i++) {
                System.out.println("Thread: " + i);
            }
        }
    }

    static class FilAmbRunnable implements Runnable {
        @Override
        public void run() {
            for (int i = 0; i <= 20; i++) {
                System.out.println("Runnable: " + i);
            }
        }
    }

    public static void main(String[] args) {
        FilAmbThread primerFil = new FilAmbThread();
        Thread segonFil = new Thread(new FilAmbRunnable());

        primerFil.start();
        segonFil.start();
    }
}
