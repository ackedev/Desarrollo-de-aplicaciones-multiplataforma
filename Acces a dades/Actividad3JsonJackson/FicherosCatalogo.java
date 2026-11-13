package Actividad3JsonJackson;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.json.JsonMapper;

public class FicherosCatalogo {
    
    private static final ObjectMapper mapper = JsonMapper.builder()
            .disable(MapperFeature.ALLOW_COERCION_OF_SCALARS)
            .disable(DeserializationFeature.ACCEPT_FLOAT_AS_INT)
            .enable(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES)
            .enable(DeserializationFeature.FAIL_ON_TRAILING_TOKENS)


            .propertyNamingStrategy(new PropertyNamingStrategies.NamingBase() {
                private static final long serialVersionUID = 1L;

                @Override
                public String translate(String nombre) {
                    return "anio".equals(nombre) ? "año" : nombre;
                }
            })
            .build();

    public static Catalogo leerXML(File archivo) throws JDOMException, IOException {
        SAXBuilder builder = new SAXBuilder();
        builder.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
        Document document = builder.build(archivo);
        Element raiz = document.getRootElement();
        if (!raiz.getName().equals("peliculas")) {
            throw new IllegalArgumentException("El elemento raíz debe ser <peliculas>.");
        }
        List<Pelicula> peliculas = new ArrayList<>();
        for (Element elemento : raiz.getChildren("pelicula")) {
            peliculas.add(crearPelicula(elemento));
        }
        Catalogo catalogo = new Catalogo(peliculas);
        validarCatalogo(catalogo);
        return catalogo;
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
        return new Pelicula(Integer.parseInt(id), titulo, director, Integer.parseInt(anio), genero);
    }

    public static Catalogo leerJSON(File archivo) throws IOException {
        if (!archivo.exists()) {
            throw new FileNotFoundException(
                    "peliculas.json no existe. Lee primero el XML con la opción 1.");
        }
        Catalogo catalogo = mapper.readValue(archivo, Catalogo.class);
        validarCatalogo(catalogo);
        return catalogo;
    }

    public static void validarCatalogo(Catalogo catalogo) {
        if (catalogo == null || catalogo.getPeliculas() == null) {
            throw new IllegalArgumentException("El JSON debe contener una lista peliculas.");
        }
        List<Integer> ids = new ArrayList<>();
        for (Pelicula pelicula : catalogo.getPeliculas()) {
            if (pelicula == null || pelicula.getId() <= 0 || pelicula.getAnio() <= 0
                    || pelicula.getTitulo() == null || pelicula.getTitulo().trim().isEmpty()
                    || pelicula.getDirector() == null || pelicula.getDirector().trim().isEmpty()
                    || pelicula.getGenero() == null || pelicula.getGenero().trim().isEmpty()) {
                throw new IllegalArgumentException("Hay datos no válidos en una película del catálogo.");
            }
            if (ids.contains(pelicula.getId())) {
                throw new IllegalArgumentException("Hay IDs repetidos en el catálogo.");
            }
            ids.add(pelicula.getId());
        }
    }

    public static void guardarJSON(File archivo, Catalogo catalogo) throws IOException {
        validarCatalogo(catalogo);
        File temporal = File.createTempFile(
                "peliculas-", ".json", archivo.getAbsoluteFile().getParentFile());
        try {
            mapper.writerWithDefaultPrettyPrinter().writeValue(temporal, catalogo);
            if (!temporal.renameTo(archivo)) {
                throw new IOException(
                        "No se pudo sustituir el JSON. El catálogo original se conserva.");
            }
        } finally {
            if (temporal.exists() && !temporal.delete()) {
                temporal.deleteOnExit();
            }
        }
    }
}
