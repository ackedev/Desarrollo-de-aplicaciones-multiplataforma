import java.io.IOException;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.nio.charset.StandardCharsets;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import java.util.Scanner;

public class Main {

    public static void main (String[] args) {
        Scanner scanner = new Scanner(System.in);
        int opcion;

        String rutaPeliculas = "datos/peliculas.txt";
        if (!new File(rutaPeliculas).exists()) {
            rutaPeliculas = "ProyectoPeliculas/datos/peliculas.txt";
        }

        List<Pelicula> peliculas = leerPeliculas(rutaPeliculas);

        // exportarXML(peliculas, "peliculas.xml");
        // peliculas = importarXML("peliculas.xml");

        do {

            mostrarMenu();
            opcion = leerOpcion(scanner);

            switch (opcion) {
                case 1:
                    if (peliculas.isEmpty()) {
                        System.out.println("No hay películas disponibles.");
                    }
                    for (Pelicula pelicula : peliculas) {
                        System.out.println(pelicula);
                    }
                    break;
                case 2:
                    System.out.println("Introduce el género:");
                    String genero = scanner.nextLine().trim();
                    boolean encontradoGenero = false;

                    for (Pelicula pelicula : peliculas) {
                        if (pelicula.getGenero().equalsIgnoreCase(genero)) {
                            System.out.println(pelicula);
                            encontradoGenero = true;
                        }
                    }
                    if (!encontradoGenero) {
                        System.out.println("No se encontraron películas de ese género.");
                    }
                    break;

                case 3:
                    System.out.println("Introduce el título o parte del título:");
                    String titulo = scanner.nextLine().trim().toLowerCase();

                    if (titulo.isEmpty()) {
                        System.out.println("Debes escribir un título.");
                        break;
                    }
                    boolean encontradoTitulo = false;

                    for (Pelicula pelicula : peliculas) {
                        if (pelicula.getTitulo().toLowerCase().contains(titulo)) {
                            System.out.println(pelicula);
                            encontradoTitulo = true;
                        }
                    }
                    if (!encontradoTitulo) {
                        System.out.println("No se encontraron películas con ese título.");
                    }
                    break;

                case 0:
                    System.out.println("Saliendo del programa.");
                    break;


                default:
                    System.out.println("Opción no válida.");
                    break;
            }

        } while (opcion != 0);

    }

    public static void exportarXML(List<Pelicula> peliculas, String nombreFichero) {
        try {
            // 1. Creamos un documento XML vacío y su etiqueta principal.
            DocumentBuilderFactory fabrica = DocumentBuilderFactory.newInstance();
            DocumentBuilder constructor = fabrica.newDocumentBuilder();
            Document documento = constructor.newDocument();

            Element raiz = documento.createElement("peliculas");
            documento.appendChild(raiz);

            // 2. Añadimos una etiqueta pelicula con sus cinco datos.
            for (Pelicula pelicula : peliculas) {
                Element elemento = documento.createElement("pelicula");
                raiz.appendChild(elemento);

                Element id = documento.createElement("id");
                id.setTextContent(String.valueOf(pelicula.getId()));
                elemento.appendChild(id);

                Element titulo = documento.createElement("titulo");
                titulo.setTextContent(pelicula.getTitulo());
                elemento.appendChild(titulo);

                Element director = documento.createElement("director");
                director.setTextContent(pelicula.getDirector());
                elemento.appendChild(director);

                Element anio = documento.createElement("anio");
                anio.setTextContent(String.valueOf(pelicula.getAnio()));
                elemento.appendChild(anio);

                Element genero = documento.createElement("genero");
                genero.setTextContent(pelicula.getGenero());
                elemento.appendChild(genero);
            }

            // 3. Transformer escribe el documento mediante BufferedWriter.
            TransformerFactory fabricaTransformer = TransformerFactory.newInstance();
            Transformer transformer = fabricaTransformer.newTransformer();
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");

            try (BufferedWriter bw = new BufferedWriter(new FileWriter(nombreFichero, StandardCharsets.UTF_8))) {
                DOMSource origen = new DOMSource(documento);
                StreamResult destino = new StreamResult(bw);
                transformer.transform(origen, destino);
            }

            System.out.println("XML exportado correctamente.");
        } catch (Exception e) {
            System.out.println("Error al exportar XML: " + e.getMessage());
        }
    }

    public static List<Pelicula> importarXML(String nombreFichero) {
        List<Pelicula> peliculas = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new FileReader(nombreFichero, StandardCharsets.UTF_8))) {

            // 1. Leemos el XML usando el BufferedReader.

         DocumentBuilderFactory fabrica = DocumentBuilderFactory.newInstance();

         // Evita que un XML pueda leer otros archivos del equipo.
            fabrica.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
            DocumentBuilder constructor = fabrica.newDocumentBuilder();
            Document documento = constructor.parse(new InputSource(br));

            // 2. Obtenemos todas las etiquetas pelicula.
            NodeList elementos = documento.getElementsByTagName("pelicula");

            for (int i = 0; i < elementos.getLength(); i++) {
                Element elemento = (Element) elementos.item(i);

                int id = Integer.parseInt(elemento.getElementsByTagName("id").item(0).getTextContent());
                String titulo = elemento.getElementsByTagName("titulo").item(0).getTextContent();
                String director = elemento.getElementsByTagName("director").item(0).getTextContent();
                int anio = Integer.parseInt(elemento.getElementsByTagName("anio").item(0).getTextContent());
                String genero = elemento.getElementsByTagName("genero").item(0).getTextContent();

                // 3. Creamos la película y la añadimos a la lista.
                Pelicula pelicula = new Pelicula(id, titulo, director, anio, genero);
                peliculas.add(pelicula);
            }
        } catch (Exception e) {
            peliculas.clear();
            System.out.println("Error al importar XML: " + e.getMessage());
        }

        return peliculas;
    }

    public static void mostrarMenu() {
        System.out.println("1. Mostrar todas");
        System.out.println("2. Buscar por género");
        System.out.println("3. Buscar por título");
        System.out.println("0. Salir");
    }

    public static int leerOpcion (Scanner scanner) {
        System.out.println("Elige una opción: ");
        while (!scanner.hasNextInt()) {
            System.out.println("Introduce una opción numérica:");
            scanner.nextLine();
        }
        int opcion = scanner.nextInt();
        scanner.nextLine();
        return opcion;
    }

    public static List<Pelicula> leerPeliculas(String nombreFichero) {
        List<Pelicula> peliculas = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new FileReader(nombreFichero))) {
            String linea;

            while ((linea = br.readLine()) != null) {
                String[] datos = linea.split("\\|");

                Pelicula pelicula = new Pelicula(
                        Integer.parseInt(datos[0]),
                        datos[1],
                        datos[2],
                        Integer.parseInt(datos[3]),
                        datos[4]
                );

                peliculas.add(pelicula);
            }
        } catch (IOException e) {
            System.out.println("Error al leer el fichero: " + e.getMessage());
        }

        return peliculas;
    }

}
