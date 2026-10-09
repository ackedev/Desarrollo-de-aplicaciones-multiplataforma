void main(){

    sumaNumerosImpares();
    // tablasMultiplicar();
    // calendario();
    // dibujarCruz();
    // ordenarArrayBidimensional();
}

void sumaNumerosImpares() {
    int suma = 0;
    for (int i = 1; i <= 99; i += 2) suma += i;
    System.out.println(suma);
}

void tablasMultiplicar() {
    for (int i = 0; i <= 10; i++) {
        System.out.println();
        for (int r = 0; r <= 10; r++)
            System.out.println(i + "X" + r + "=" + i * r);
    }
}

void calendario() {
    String[] meses = {"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"};
    int[] diasPorMes = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

    for (int mes = 0; mes < meses.length; mes++) {
        System.out.println("\n\n\n" + meses[mes]);
        System.out.println("Lun Mar Mier Jue Vie Sab Dom\n");
        for (int dia = 1; dia <= diasPorMes[mes]; dia++) {
            if (dia % 7 == 1) System.out.println();
            System.out.print(dia + "  ");
        }
    }
}

void dibujarCruz() {
    int total = 9;
    int centro = total / 2 + 1;
    for (int altura = 1; altura <= total; altura++) {
        for (int llarg = 1; llarg <= total; llarg++) {
            if (altura == centro || llarg == centro || altura == llarg
                    || altura + llarg == total + 1) System.out.print("* ");
            else System.out.print("  ");
        }
        System.out.println();
    }
}

void ordenarArrayBidimensional() { 

}
