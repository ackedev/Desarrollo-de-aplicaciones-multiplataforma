package Actividad3JsonJackson;

import java.io.File;
import java.io.IOException;
import java.util.Scanner;

import org.jdom2.JDOMException;

public class Main {
    static File archivoXML = new File("Actividad3JsonJackson/Datos/peliculas.xml");
    static File archivoJSON = new File("Actividad3JsonJackson/Datos/peliculas.json");

    public static void main(String[] args) {
        if (new File("Datos").isDirectory()) {
            archivoXML = new File("Datos/peliculas.xml");
            archivoJSON = new File("Datos/peliculas.json");
        }
        if (!archivoXML.exists()) {
            System.out.println("El fichero peliculas.xml no existe. El programa se detiene.");
            return;
        }
        Scanner scanner = new Scanner(System.in);
        int opcion;
        do {
            mostrarMenu();
            if (!scanner.hasNextLine()) {
                break;
            }
            try {
                opcion = leerOpcion(scanner);
                switch (opcion) {
                    case 1:
                        convertirXMLaJSON(scanner);
                        break;
                    case 2:
                        mostrarPeliculas(FicherosCatalogo.leerJSON(archivoJSON));
                        break;
                    case 3:
                        buscarPelicula(scanner);
                        break;
                    case 4:
                        añadirPelicula(scanner);
                        break;
                    case 5:
                        modificarPelicula(scanner);
                        break;
                    case 6:
                        eliminarPelicula(scanner);
                        break;
                    case 0:
                        System.out.println("Saliendo del programa.");
                        return;
                    default:
                        System.out.println("Opción no válida.");
                }
            } catch (JDOMException | IOException | IllegalArgumentException e) {
                // JsonProcessingException deriva de IOException; también queda capturada.
                System.out.println("Error: " + e.getMessage());
            }
        } while (true);
    }

    public static void mostrarMenu() {
        System.out.println("\n========== CATÁLOGO DE PELÍCULAS ==========");
        System.out.println("1. Convertir XML a JSON");
        System.out.println("2. Mostrar todas las películas");
        System.out.println("3. Buscar una película por ID");
        System.out.println("4. Añadir una película");
        System.out.println("5. Modificar una película por ID");
        System.out.println("6. Eliminar una película por ID");
        System.out.println("0. Salir");
        System.out.println("==========================================");
        System.out.println("Selecciona una opción:");
    }

    public static int leerOpcion(Scanner scanner) {
        return leerNumero(scanner);
    }

    // Si un dato no es válido, repetimos ese paso en vez de cancelar la operación.
    public static int leerNumero(Scanner scanner) {
        while (scanner.hasNextLine()) {
            String entrada = scanner.nextLine().trim();
            try {
                return Integer.parseInt(entrada);
            } catch (NumberFormatException e) {
                System.out.println("Introduce un número entero válido:");
            }
        }
        throw new IllegalArgumentException("No hay más datos de entrada.");
    }

    public static String leerTexto(Scanner scanner, String mensaje) {
        System.out.println(mensaje);
        while (scanner.hasNextLine()) {
            String texto = scanner.nextLine().trim();
            if (!texto.isEmpty()) {
                return texto;
            }
            System.out.println("El campo no puede estar vacío. Inténtalo de nuevo:");
        }
        throw new IllegalArgumentException("No hay más datos de entrada.");
    }

    public static int leerAnio(Scanner scanner) {
        System.out.println("El año en que fue publicada:");
        int anio = leerNumero(scanner);
        while (anio <= 0) {
            System.out.println("Introduce un año mayor que cero:");
            anio = leerNumero(scanner);
        }
        return anio;
    }

    public static void convertirXMLaJSON(Scanner scanner) throws JDOMException, IOException {
        if (archivoJSON.exists()) {
            String respuesta = leerTexto(scanner,
                    "El JSON ya existe. Se perderán sus cambios. ¿Reconviertes el XML? (s/n):");
            if (!respuesta.equalsIgnoreCase("s") && !respuesta.equalsIgnoreCase("si")
                    && !respuesta.equalsIgnoreCase("sí")) {
                System.out.println("Conversión cancelada.");
                return;
            }
        }
        Catalogo catalogo = FicherosCatalogo.leerXML(archivoXML);
        FicherosCatalogo.guardarJSON(archivoJSON, catalogo);
        System.out.println("XML convertido a JSON: " + catalogo.getPeliculas().size() + " películas.");
    }

    public static void mostrarPeliculas(Catalogo catalogo) {
        if (catalogo.getPeliculas().isEmpty()) {
            System.out.println("No hay películas disponibles.");
        }
        for (Pelicula pelicula : catalogo.getPeliculas()) {
            System.out.println(pelicula);
        }
    }

    public static Pelicula buscarPorId(Catalogo catalogo, int id) {
        for (Pelicula pelicula : catalogo.getPeliculas()) {
            if (pelicula.getId() == id) {
                return pelicula;
            }
        }
        return null;
    }

    public static void buscarPelicula(Scanner scanner) throws IOException {
        Catalogo catalogo = FicherosCatalogo.leerJSON(archivoJSON);
        System.out.println("Introduce el ID que quieres buscar:");
        Pelicula encontrada = buscarPorId(catalogo, leerNumero(scanner));
        if (encontrada == null) {
            System.out.println("No se ha encontrado película con ese ID.");
            return;
        }
        System.out.println(encontrada);
    }

    public static void añadirPelicula(Scanner scanner) throws IOException {
        Catalogo catalogo = FicherosCatalogo.leerJSON(archivoJSON);
        int idMaximo = 0;
        for (Pelicula pelicula : catalogo.getPeliculas()) {
            if (pelicula.getId() > idMaximo) {
                idMaximo = pelicula.getId();
            }
        }
        if (idMaximo == Integer.MAX_VALUE) {
            System.out.println("No quedan identificadores disponibles.");
            return;
        }
        String titulo = leerTexto(scanner, "Introduce el título:");
        String director = leerTexto(scanner, "El director de la película:");
        int anio = leerAnio(scanner);
        String genero = leerTexto(scanner, "El género de la película:");
        int nuevoID = idMaximo + 1;
        catalogo.getPeliculas().add(new Pelicula(nuevoID, titulo, director, anio, genero));
        FicherosCatalogo.guardarJSON(archivoJSON, catalogo);
        System.out.println("Película añadida con ID " + nuevoID + ".");
    }

    public static void modificarPelicula(Scanner scanner) throws IOException {
        Catalogo catalogo = FicherosCatalogo.leerJSON(archivoJSON);
        System.out.println("Introduce el ID que quieres modificar:");
        Pelicula encontrada = buscarPorId(catalogo, leerNumero(scanner));
        if (encontrada == null) {
            System.out.println("No se ha encontrado película con ese ID.");
            return;
        }
        System.out.println("Datos actuales: " + encontrada);
        String titulo = leerTexto(scanner, "Nuevo título:");
        String director = leerTexto(scanner, "Nuevo director:");
        int anio = leerAnio(scanner);
        String genero = leerTexto(scanner, "Nuevo género:");
        encontrada.setTitulo(titulo);
        encontrada.setDirector(director);
        encontrada.setAnio(anio);
        encontrada.setGenero(genero);
        FicherosCatalogo.guardarJSON(archivoJSON, catalogo);
        System.out.println("Película modificada correctamente.");
    }

    public static void eliminarPelicula(Scanner scanner) throws IOException {
        Catalogo catalogo = FicherosCatalogo.leerJSON(archivoJSON);
        System.out.println("Introduce el ID que quieres eliminar:");
        Pelicula encontrada = buscarPorId(catalogo, leerNumero(scanner));
        if (encontrada == null) {
            System.out.println("No se ha encontrado película con ese ID.");
            return;
        }
        System.out.println("Película a eliminar: " + encontrada);
        // Borrado físico: quitamos el objeto sin renumerar los demás IDs.
        catalogo.getPeliculas().remove(encontrada);
        FicherosCatalogo.guardarJSON(archivoJSON, catalogo);
        System.out.println("Película eliminada mediante borrado físico.");
    }
}
