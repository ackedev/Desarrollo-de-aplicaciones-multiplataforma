void main() {
    exercici1();
    // exercici2();
    // exercici3();
}

void exercici1() {
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

void exercici2(){
    
}
