import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

void main() throws IOException {
    
    ejercicio6();
}

void ejercicio1() throws IOException {
    Path ruta = Path.of("Programació d'interficies/spanish.lst");
    var lineas = Files.readAllLines(ruta);
    Map<Character, Integer> contadorLetras = new HashMap<>();

    for (String linea : lineas) {

        for (char caracter : linea.toCharArray()) {

            caracter = Character.toLowerCase(caracter);

            if (contadorLetras.containsKey(caracter)) {

                int cantidad = contadorLetras.get(caracter);
                contadorLetras.put(caracter, cantidad + 1);
            } 
            else {
                contadorLetras.put(caracter, 1);
            }
        }
    } 
    for (Map.Entry<Character, Integer> entrada : contadorLetras.entrySet()) {
        System.out.println(entrada.getKey() + ": " + entrada.getValue());
    }
}

void ejercicio2() throws IOException {
    Path ruta = Path.of("Programació d'interficies/spanish.lst");
    var lineas = Files.readAllLines(ruta);
    // Numero de palabras total
    int contadorPalabras = 0;

    for (String linea : lineas) {
        if (linea != null){
            contadorPalabras++;
        }
    }
    System.out.println(contadorPalabras);


 }

void ejercicio3() throws IOException {

    // Per cadascuna de les lletres quantes paraules hi comencen

    Path ruta = Path.of("Programació d'interficies/spanish.lst");
    var lineas = Files.readAllLines(ruta);
    Map<Character, Integer> contadorIniciales = new HashMap<>();

    for (String linea : lineas) {
        if (!linea.equals("")) {
            char primeraLetra = linea.charAt(0);
            primeraLetra = Character.toLowerCase(primeraLetra);

            if (contadorIniciales.containsKey(primeraLetra)) {
                int cantidad = contadorIniciales.get(primeraLetra);
                contadorIniciales.put(primeraLetra, cantidad +1);
            }
            else {
                contadorIniciales.put(primeraLetra, 1);
            
            }
        }
    }

    for (Map.Entry<Character, Integer> entrada : contadorIniciales.entrySet()) {
        System.out.println(entrada.getKey() + ": " + entrada.getValue());
    }



 }

void ejercicio4() throws IOException {
    // Nombre mitjà de cadascuna de les lletres per paraula
    Path ruta = Path.of("Programació d'interficies/spanish.lst");
    var lineas = Files.readAllLines(ruta);
    int totalPalabras = 0;
    Map<Character, Integer> contadorLetras = new HashMap<>();

    for (String linea : lineas) {
        if (!linea.equals("")) {
            totalPalabras++;

            for (char caracter : linea.toCharArray()) {
                caracter = Character.toLowerCase(caracter);

                if (contadorLetras.containsKey(caracter)) {
                    int cantidad = contadorLetras.get(caracter);
                    contadorLetras.put(caracter, cantidad + 1);
                } else {
                    contadorLetras.put(caracter, 1);
                }
            }
        }
    }

    for (Map.Entry<Character, Integer> entrada : contadorLetras.entrySet()) {
        double media = (double) entrada.getValue() / totalPalabras;
        char letra = entrada.getKey();
        System.out.printf("Letra: %c, Media: %.3f%n", letra, media);
    }

}

void ejercicio5() throws IOException {
    // Nombre total de paraules que contenen cada lletra

    Path ruta = Path.of("Programació d'interficies/spanish.lst");
    var lineas = Files.readAllLines(ruta);
    Map<Character, Integer> contadorPalabrasPorLetra = new HashMap<>();

    for (String linea : lineas) {
        HashSet<Character> letrasDeEstaPalabra = new HashSet<>();

        for (char caracter : linea.toCharArray()) {
            caracter = Character.toLowerCase(caracter); 
            letrasDeEstaPalabra.add(caracter);
        }

        for (char caracter : letrasDeEstaPalabra) {
            if (contadorPalabrasPorLetra.containsKey(caracter)) {
                int cantidad = contadorPalabrasPorLetra.get(caracter);
                contadorPalabrasPorLetra.put(caracter, cantidad + 1);
            } else {
                contadorPalabrasPorLetra.put(caracter, 1);
            }
        }
    }

    for (Map.Entry<Character, Integer> entrada : contadorPalabrasPorLetra.entrySet()) {
        System.out.println(entrada.getKey() + ": " + entrada.getValue());
    }


}

void ejercicio6(){
    int[][] matrizA = {
            {1, 2},
            {3, 4},
            {5, 6}
    };

    int[][] matrizB = {
            {7, 8, 9, 10},
            {11, 12, 13, 14}
    };

    int[][] resultado = new int[matrizA.length][matrizB[0].length];

    // Recorre cada fila de la primera matriz y del resultado.
    for (int fila = 0; fila < matrizA.length; fila++) {
        // Recorre cada columna de la segunda matriz y del resultado.
        for (int columna = 0; columna < matrizB[0].length; columna++) {
            // Recorre las posiciones que se deben multiplicar y sumar.
            // matrizA[fila][k] se multiplica por matrizB[k][columna].
            for (int k = 0; k < matrizA[0].length; k++) {
                resultado[fila][columna] += matrizA[fila][k] * matrizB[k][columna];
            }
        }
    }

    for (int fila = 0; fila < resultado.length; fila++) {
        for (int columna = 0; columna < resultado[fila].length; columna++) {
            System.out.print(resultado[fila][columna] + " ");
        }
        System.out.println();
    }

}

    
