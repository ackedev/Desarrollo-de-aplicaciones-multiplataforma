import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;

public class Main {
    static List<Pelicula> peliculas = new ArrayList<>();
    static File archivo = new File("Activitat2SeguimientoPeliculas/Datos/peliculas.xml");

    public static void main(String[] args) {
        if (new File("Datos").isDirectory()) {
            archivo = new File("Datos/peliculas.xml");
        }
        try {
            leerPeliculasXML();
        } catch (JDOMException | IOException | IllegalArgumentException e) {
            System.out.println("Error al leer el catálogo: " + e.getMessage());
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
            } catch (IllegalArgumentException e) {
                System.out.println("Error: " + e.getMessage());
                break;
            }
            try {
                switch (opcion) {
                    case 1:
                        leerPeliculasXML();
                        mostrarPeliculas();
                        break;
                    case 2:
                        buscarPelicula(scanner);
                        break;
                    case 3:
                        añadirPelicula(scanner);
                        break;
                    case 4:
                        modificarPelicula(scanner);
                        break;
                    case 5:
                        eliminarPelicula(scanner);
                        break;
                    case 0:
                        System.out.println("Saliendo del programa.");
                        break;
                    default:
                        System.out.println("Opción no válida.");
                }
            } catch (JDOMException | IOException | IllegalArgumentException e) {
                System.out.println("Error: " + e.getMessage());
            }
        } while (opcion != 0 && scanner.hasNextLine());
    }

    public static void leerPeliculasXML() throws JDOMException, IOException {
        Document document = cargarDocumento();
        List<Pelicula> leidas = new ArrayList<>();
        
        for (Element elemento : document.getRootElement().getChildren("pelicula")) {
            leidas.add(crearPelicula(elemento));
        }

        peliculas.clear();
        peliculas.addAll(leidas);
    }

    public static void mostrarPeliculas() {
        if (peliculas.isEmpty()) {
            System.out.println("No hay películas disponibles.");
        }
        for (Pelicula pelicula : peliculas) {
            System.out.println(pelicula);
        }
    }

    public static void buscarPelicula(Scanner scanner) throws JDOMException, IOException {
        leerPeliculasXML();
        System.out.println("Introduce el ID que quieres buscar:");
        int id = leerNumero(scanner);
        for (Pelicula pelicula : peliculas) {
            if (pelicula.getId() == id) {
                System.out.println(pelicula);
                return;
            }
        }
        System.out.println("No se ha encontrado película con ese ID.");
    }

    public static void mostrarMenu() {
        System.out.println("\n========== CATÁLOGO DE PELÍCULAS ==========");
        System.out.println("1. Mostrar todas las películas");
        System.out.println("2. Buscar una película por ID");
        System.out.println("3. Añadir una película");
        System.out.println("4. Modificar una película por ID");
        System.out.println("5. Eliminar una película por ID");
        System.out.println("0. Salir");
    }

    public static int leerOpcion(Scanner scanner) {
        System.out.println("Elige una opción:");
        return leerNumero(scanner);
    }

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

    public static void añadirPelicula(Scanner scanner) throws JDOMException, IOException {
        Document document = cargarDocumento();
        Element raiz = document.getRootElement();
        int idMaximo = Integer.parseInt(raiz.getAttributeValue("ultimoId"));
        if (idMaximo == Integer.MAX_VALUE) {
            System.out.println("No quedan identificadores disponibles.");
            return;
        }
        String titulo = leerTexto(scanner, "Introduce el título:");
        String director = leerTexto(scanner, "El director de la película:");
        int anio = leerAnio(scanner);
        String genero = leerTexto(scanner, "El género de la película:");
        int nuevoID = idMaximo + 1;

        Element nuevaPelicula = new Element("pelicula");
        nuevaPelicula.setAttribute("id", String.valueOf(nuevoID));
        nuevaPelicula.addContent(new Element("titulo").setText(titulo));
        nuevaPelicula.addContent(new Element("director").setText(director));
        nuevaPelicula.addContent(new Element("anio").setText(String.valueOf(anio)));
        nuevaPelicula.addContent(new Element("genero").setText(genero));

        raiz.addContent(nuevaPelicula);
        raiz.setAttribute("ultimoId", String.valueOf(nuevoID));

        guardarDocumento(document);
        leerPeliculasXML();
        System.out.println("Película añadida con ID " + nuevoID + ".");
    }

    public static void modificarPelicula(Scanner scanner) throws JDOMException, IOException {
        Document document = cargarDocumento();
        System.out.println("Introduce el ID que quieres modificar:");
        int id = leerNumero(scanner);
        Element encontrada = null;

        for (Element elemento : document.getRootElement().getChildren("pelicula")) {
            if (Integer.parseInt(elemento.getAttributeValue("id")) == id) {
                encontrada = elemento;
                break;
            }
        }
        if (encontrada == null) {
            System.out.println("No se ha encontrado película con ese ID.");
            return;
        }
        System.out.println("Datos actuales: " + crearPelicula(encontrada));
        String titulo = leerTexto(scanner, "Nuevo título:");
        String director = leerTexto(scanner, "Nuevo director:");
        int anio = leerAnio(scanner);
        String genero = leerTexto(scanner, "Nuevo género:");

        encontrada.getChild("titulo").setText(titulo);
        encontrada.getChild("director").setText(director);
        encontrada.getChild("anio").setText(String.valueOf(anio));
        encontrada.getChild("genero").setText(genero);
        
        guardarDocumento(document);
        leerPeliculasXML();
        System.out.println("Película modificada correctamente.");
    }

    public static void eliminarPelicula(Scanner scanner) throws JDOMException, IOException {
        Document document = cargarDocumento();
        Element raiz = document.getRootElement();
        System.out.println("Introduce el ID que quieres eliminar:");
        int id = leerNumero(scanner);
        Element encontrada = null;

        for (Element elemento : raiz.getChildren("pelicula")) {
            if (Integer.parseInt(elemento.getAttributeValue("id")) == id) {
                encontrada = elemento;
                break;
            }
        }

        if (encontrada == null) {
            System.out.println("No se ha encontrado película con ese ID.");
            return;
        }

        System.out.println("Película: " + crearPelicula(encontrada));
        String respuesta = leerTexto(scanner, "¿Confirmas la eliminación? (s/n):");
        
        if (!respuesta.equalsIgnoreCase("s") && !respuesta.equalsIgnoreCase("si")
                && !respuesta.equalsIgnoreCase("sí")) {
            System.out.println("Eliminación cancelada.");
            return;
        
        }
        // Borrado físico: quitamos el elemento sin renumerar los demás IDs.
        raiz.removeContent(encontrada);
        guardarDocumento(document);
        leerPeliculasXML();
        System.out.println("Película eliminada mediante borrado físico.");
    }

    public static Document cargarDocumento() throws JDOMException, IOException {
        Document document = new SAXBuilder().build(archivo);
        Element raiz = document.getRootElement();
        if (!raiz.getName().equals("peliculas")) {
            throw new IllegalArgumentException("El elemento raíz debe ser <peliculas>.");
        }
        int maximo = 0;
        List<Integer> ids = new ArrayList<>();
        for (Element elemento : raiz.getChildren("pelicula")) {
            Pelicula pelicula = crearPelicula(elemento);
            if (ids.contains(pelicula.getId())) {
                throw new IllegalArgumentException("Hay IDs repetidos en el XML.");
            }
            ids.add(pelicula.getId());
            if (pelicula.getId() > maximo) {
                maximo = pelicula.getId();
            }
        }
        // Conservamos el máximo histórico aunque se elimine la última película.
        String ultimoId = raiz.getAttributeValue("ultimoId");
        if (ultimoId != null && Integer.parseInt(ultimoId) > maximo) {
            maximo = Integer.parseInt(ultimoId);
        }
        raiz.setAttribute("ultimoId", String.valueOf(maximo));
        return document;
    }

    public static Pelicula crearPelicula(Element elemento) {
        String id = elemento.getAttributeValue("id");
        String titulo = elemento.getChildText("titulo");
        String director = elemento.getChildText("director");
        String anio = elemento.getChildText("anio");
        String genero = elemento.getChildText("genero");
        if (id == null || titulo == null || director == null || anio == null || genero == null) {
            throw new IllegalArgumentException("Faltan atributos o campos en una película del XML.");
        }
        int numeroId = Integer.parseInt(id);
        int numeroAnio = Integer.parseInt(anio);
        if (numeroId <= 0 || numeroAnio <= 0 || titulo.trim().isEmpty()
                || director.trim().isEmpty() || genero.trim().isEmpty()) {
            throw new IllegalArgumentException("Hay datos no válidos en una película del XML.");
        }
        return new Pelicula(numeroId, titulo, director, numeroAnio, genero);
    }

    public static void guardarDocumento(Document document) throws IOException {
        File temporal = File.createTempFile("peliculas-", ".xml", archivo.getParentFile());
        try {
            XMLOutputter salida = new XMLOutputter(Format.getPrettyFormat());
            try (FileWriter writer = new FileWriter(temporal)) {
                salida.output(document, writer);
            }
            if (!temporal.renameTo(archivo)) {
                throw new IOException("No se pudo sustituir el XML. El catálogo original se conserva.");
            }
        } finally {
            if (temporal.exists() && !temporal.delete()) {
                temporal.deleteOnExit();
            }
        }
    }

}
