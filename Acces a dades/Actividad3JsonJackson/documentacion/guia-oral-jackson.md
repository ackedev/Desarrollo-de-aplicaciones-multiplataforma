# Actividad 3 · Catálogo de películas con Jackson

Guía de preparación para la demostración y el examen oral · Acceso a Datos · 2.º DAM

Esta práctica continúa el catálogo de películas de las actividades anteriores. Primero lee el XML con JDOM2 y lo transforma en objetos Java. Jackson convierte esos objetos en un JSON. A partir de ahí, las consultas, las altas, las modificaciones y los borrados utilizan el JSON.

## Qué debes poder explicar

- Qué guardan Pelicula y Catalogo, y por qué Jackson necesita sus constructores y métodos de acceso.
- Cómo viajan los datos desde el XML hasta los objetos y después hasta peliculas.json.
- Cómo se localiza una película por su ID y se guarda cada operación CRUD.
- Qué sucede cuando el usuario escribe un dato incorrecto o falla un fichero.

## El recorrido principal

```text
Solo al migrar:
XML -> SAXBuilder (JDOM2) -> Catalogo con Pelicula
    -> ObjectMapper (Jackson) -> peliculas.json

En las operaciones de gestión:
peliculas.json -> Catalogo -> consultar o modificar objetos
               -> guardar JSON si hay cambios
```

## Explicación inicial para el oral

«He reutilizado el modelo, las validaciones de consola y la lectura XML de las actividades anteriores. JDOM2 se usa para la conversión inicial y Jackson para leer y guardar JSON. El menú permite consultar y hacer cambios por ID; cada cambio se guarda antes de anunciar que ha terminado».

El programa es de consola y usa cuatro clases sencillas. La organización sigue las necesidades de este ejercicio.

<!-- SALTO DE PAGINA -->

# Conceptos previos · objetos y persistencia

## POJO

Un POJO es un objeto Java convencional. Pelicula guarda los datos de una película en atributos privados y ofrece constructores, getters y setters. Catalogo agrupa una lista de esas películas.

Un getter permite leer un atributo. Un setter permite asignarle otro valor. Jackson aprovecha esos nombres para asociar propiedades del JSON con datos del objeto.

## Serialización y deserialización

| Concepto | Dirección | Ejemplo del proyecto |
| --- | --- | --- |
| Serializar | Objetos Java a JSON | writeValue(temporal, catalogo) |
| Deserializar | JSON a objetos Java | readValue(archivo, Catalogo.class) |
| Persistir | Guardar datos para otra ejecución | Sustituir peliculas.json tras un cambio |

Modificar una lista en memoria no basta para conservar el cambio. Si el programa termina antes de escribir el fichero, ese cambio desaparece.

## El documento JSON

```json
{
  "peliculas": [
    {
      "id": 1,
      "titulo": "Interstellar",
      "director": "Christopher Nolan",
      "año": 2014,
      "genero": "Ciencia ficción"
    }
  ]
}
```

- Las llaves delimitan un objeto. Los corchetes delimitan un array.
- La raíz es un objeto con una propiedad llamada peliculas, que contiene el array.
- id y año son números enteros, sin comillas. Los otros campos son textos.
- La sangría facilita la lectura. Jackson la genera; no se construye JSON concatenando cadenas.

**Para el oral:** «Serializar es convertir los objetos a JSON; persistir es dejar ese resultado guardado para recuperarlo después».

<!-- SALTO DE PAGINA -->

# Archivos y bibliotecas

```text
Actividad3JsonJackson/
  Main.java                 Menú, entrada y operaciones
  Pelicula.java             Datos de una película
  Catalogo.java             Lista y objeto raíz del JSON
  FicherosCatalogo.java      Migración y persistencia
  Datos/peliculas.xml       Catálogo inicial de Actividad 2
  Datos/peliculas.json      Catálogo usado por el CRUD
  lib/                      JDOM2 y Jackson
  run.sh                    Compila y ejecuta
  probar.sh                 Lanza las pruebas automáticas
```

## Qué se ha reutilizado

Pelicula procede del modelo de Actividad 1 y 2. Se le añaden el constructor vacío, los setters y el nombre Java anio; Jackson lo convierte a la propiedad JSON año exigida.

De Actividad 2 se aprovechan la entrada de números, texto y año, los recorridos por ID, la lectura de los elementos XML y el patrón de guardado mediante un temporal. La lectura TXT y las escrituras XML ya no son necesarias.

## Dependencias incluidas

| Biblioteca | Función |
| --- | --- |
| JDOM2 2.0.6.1 | Leer el XML de origen con SAXBuilder |
| jackson-databind 2.21.8 | ObjectMapper y conversión de objetos |
| jackson-core 2.21.8 | Motor JSON utilizado por databind |
| jackson-annotations 2.21 | Dependencia interna de databind |

Aunque exista el JAR jackson-annotations, el código no usa anotaciones de mapeo. Los tres módulos forman la biblioteca Jackson necesaria para ObjectMapper.

**Para el oral:** «No uso Gson ni otras bibliotecas JSON. JDOM2 lee el XML y Jackson realiza toda la lectura y escritura del JSON».

El proyecto incluye los JAR: no necesita Maven ni descargar bibliotecas al ejecutarse. La configuración exacta está en lib/README.md.

<!-- SALTO DE PAGINA -->

# Pelicula · el objeto de datos

**Pelicula.java · líneas 1-19**

```java
package Actividad3JsonJackson;

public class Pelicula {
    private int id;
    private String titulo;
    private String director;
    private int anio;
    private String genero;

    public Pelicula() {
    }

    public Pelicula(int id, String titulo, String director, int anio, String genero) {
        this.id = id;
        this.titulo = titulo;
        this.director = director;
        this.anio = anio;
        this.genero = genero;
    }
```

## Atributos y constructores

Los cinco atributos representan los campos obligatorios de cada película. id y año son int; titulo, director y genero son String.

El constructor vacío permite que Jackson cree una película al deserializar. Después puede rellenar sus datos mediante los setters. El constructor con parámetros se usa cuando ya tenemos todos los valores, por ejemplo al leer el XML o al dar de alta una película.

**Pelicula.java · líneas 45-51**

```java
    public int getAnio() {
        return anio;
    }

    public void setAnio(int anio) {
        this.anio = anio;
    }
```

## Por qué Java usa anio y JSON conserva año

El XML anterior guarda la etiqueta anio. El enunciado nuevo pide la propiedad JSON año. Durante la migración se lee anio y su valor se pasa al constructor de Pelicula.

El atributo Java anio usa getAnio()/setAnio(). La estrategia de nombres configurada en Jackson traduce anio a la clave JSON año. No se usan anotaciones de mapeo. El código se compila en UTF-8.

Los demás getters y setters siguen la misma estructura. toString() reúne los cinco datos para mostrarlos en consola; no escribe el JSON. Quien escribe JSON es Jackson.

**Pregunta habitual:** «¿Para qué necesito dos constructores?»

El vacío permite crear el objeto sin datos iniciales durante la lectura JSON. El completo simplifica crear películas desde el XML o los datos introducidos por el usuario.

<!-- SALTO DE PAGINA -->

# Catalogo · la raíz del documento

**Catalogo.java · líneas 1-23**

```java
package Actividad3JsonJackson;

import java.util.ArrayList;
import java.util.List;

public class Catalogo {
    private List<Pelicula> peliculas;

    public Catalogo() {
    }

    public Catalogo(List<Pelicula> peliculas) {
        this.peliculas = new ArrayList<>(peliculas);
    }

    public List<Pelicula> getPeliculas() {
        return peliculas;
    }

    public void setPeliculas(List<Pelicula> peliculas) {
        this.peliculas = peliculas;
    }
}
```

## Por qué existe esta clase

El JSON no es directamente un array. Tiene un objeto raíz con la propiedad peliculas. Catalogo representa esa raíz y su lista representa el array.

List<Pelicula> indica que cada elemento debe ser una Pelicula. Al leer Catalogo.class, Jackson también puede conocer el tipo de los elementos de esa lista.

## Sus dos constructores

- El vacío lo utiliza Jackson al leer JSON.
- El que recibe una lista lo utiliza la migración. new ArrayList<>(peliculas) crea una lista nueva que contiene las películas recibidas.

La lista queda inicialmente null en el constructor vacío. Esto permite detectar un JSON sin la propiedad peliculas: la validación lo rechaza. Una lista vacía válida se representa con peliculas: [].

**Pregunta habitual:** «¿Por qué no lees con List.class?»

Porque necesitamos el objeto raíz del enunciado. Catalogo conserva esa estructura e indica que la lista contiene objetos Pelicula, sin usar mapas genéricos ni un árbol manual de nodos JSON.

<!-- SALTO DE PAGINA -->

# FicherosCatalogo · preparar Jackson y leer XML

**FicherosCatalogo.java · líneas 20-36**

```java
public class FicherosCatalogo {
    // Impide aceptar texto, decimales o null en los campos enteros del JSON.
    private static final ObjectMapper mapper = JsonMapper.builder()
            .disable(MapperFeature.ALLOW_COERCION_OF_SCALARS)
            .disable(DeserializationFeature.ACCEPT_FLOAT_AS_INT)
            .enable(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES)
            .enable(DeserializationFeature.FAIL_ON_TRAILING_TOKENS)
            // El código usa anio; el enunciado exige la clave JSON "año".
            .propertyNamingStrategy(new PropertyNamingStrategies.NamingBase() {
                private static final long serialVersionUID = 1L;

                @Override
                public String translate(String nombre) {
                    return "anio".equals(nombre) ? "año" : nombre;
                }
            })
            .build();
```

## Un ObjectMapper compartido

JsonMapper es una implementación de ObjectMapper especializada en JSON. El builder crea el mapper con opciones que rechazan conversiones que ocultarían datos incorrectos: texto como entero, decimales como enteros, null en un int y contenido adicional después del documento.

La estrategia de nombres traduce anio a año para conservar el JSON del enunciado con métodos Java sin ñ. El resto de nombres se mantiene igual. Las cuatro clases usan el paquete Actividad3JsonJackson para evitar conflictos con las actividades anteriores.

**FicherosCatalogo.java · líneas 38-53**

```java
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
```

## Recorrido de la migración

SAXBuilder construye el árbol XML. getRootElement() obtiene la raíz y getChildren("pelicula") recorre los registros. Cada elemento se convierte en una Pelicula y se añade a la lista.

La raíz debe ser peliculas. Al terminar se valida la colección completa antes de devolver el Catalogo. El bloqueo de DOCTYPE evita que el XML solicite documentos externos.

<!-- SALTO DE PAGINA -->

# De cada elemento XML a un objeto Java

**FicherosCatalogo.java · líneas 55-65**

```java
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
```

## Atributo y etiquetas

El XML guarda el ID como atributo de pelicula y los otros datos como etiquetas hijas. Por eso se utilizan dos métodos distintos:

- getAttributeValue("id") obtiene el texto del atributo id.
- getChildText("titulo") y los otros getChildText leen el contenido de las etiquetas.

Si falta algún campo, se lanza IllegalArgumentException. Integer.parseInt convierte el ID y el año a int; si el texto no representa un entero válido, lanza NumberFormatException.

## El cambio de formato

En XML se lee anio. En Java el atributo es anio y en JSON la propiedad es año. El valor no cambia: por ejemplo, el texto XML 2014 se convierte al entero Java 2014 y Jackson lo escribe como número JSON 2014.

El atributo ultimoId del XML anterior no se incorpora al JSON. Esta actividad define el ID nuevo como máximo existente más uno y exige una raíz con la lista peliculas.

## Los registros de partida

El XML copiado tiene 45 películas, IDs hasta el 47 y huecos en el 3 y el 41. La migración conserva todos sus registros y no rellena los huecos. El primer ID de una nueva alta, con este catálogo, será el 48.

**Para el oral:** «No cambio los datos del catálogo: transformo su representación. La lectura XML es el paso inicial; las operaciones posteriores leen JSON».

<!-- SALTO DE PAGINA -->

# Leer JSON y validar el catálogo

**FicherosCatalogo.java · líneas 67-75**

```java
public static Catalogo leerJSON(File archivo) throws IOException {
    if (!archivo.exists()) {
        throw new FileNotFoundException(
                "peliculas.json no existe. Lee primero el XML con la opción 1.");
    }
    Catalogo catalogo = mapper.readValue(archivo, Catalogo.class);
    validarCatalogo(catalogo);
    return catalogo;
}
```

## Deserialización

readValue recibe el fichero y la clase de destino. Devuelve un Catalogo cuyas películas son objetos Pelicula. Si el JSON no existe se informa de que debe utilizarse la opción 1.

La carga no sobrescribe ficheros. Si el JSON está roto, se comunica el error y no se regenera automáticamente desde el XML.

**FicherosCatalogo.java · líneas 77-94**

```java
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
```

## Qué protege esta validación

Rechaza un catálogo nulo, una lista ausente, películas nulas, IDs o años no positivos, textos vacíos y IDs repetidos. trim().isEmpty() también detecta textos formados solo por espacios.

ids guarda los identificadores ya vistos. contains avisa de una repetición. La misma validación se ejecuta tras leer XML, tras leer JSON y antes de guardar.

<!-- SALTO DE PAGINA -->

# Guardar JSON sin truncar el catálogo anterior

**FicherosCatalogo.java · líneas 96-111**

```java
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
```

## El orden es importante

1. Se comprueba que el catálogo contiene datos válidos.
2. Se crea un fichero temporal en la misma carpeta que el JSON.
3. Jackson escribe el catálogo completo con sangría en ese temporal.
4. Solo al terminar se intenta sustituir el JSON anterior.
5. finally limpia el temporal que haya quedado.

writeValue recibe Catalogo, por lo que conserva el objeto raíz peliculas. writerWithDefaultPrettyPrinter() añade sangría y saltos de línea. No se usa FileWriter para construir manualmente un JSON.

## Si algo falla

Si la escritura del temporal falla, el JSON anterior todavía no se ha tocado. Si renameTo no puede sustituirlo, se lanza IOException. El menú captura ese error y no imprime el mensaje de éxito.

Cada operación utiliza un catálogo local recién leído. Si guardar falla, ese objeto modificado se descarta al salir del método; la siguiente consulta vuelve a leer el fichero que seguía siendo válido.

**Para el oral:** «Primero completo la copia nueva y después sustituyo el fichero. No abro el JSON original para vaciarlo antes de saber si puedo guardar».

El ejercicio se ejecuta con un solo proceso. Este guardado no coordina ediciones simultáneas de varios programas ni sustituye las garantías de una base de datos.

<!-- SALTO DE PAGINA -->

# Main · arranque y ciclo del menú

**Main.java · líneas 13-61**

```java
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
```

## Qué debes seguir al leerlo

Las rutas iniciales permiten ejecutar desde Acces a dades. Si existe la carpeta Datos en el directorio de trabajo, se usan las rutas cortas. run.sh entra primero en la carpeta del proyecto.

Si el XML no existe al arrancar, se muestra el problema y return termina main, como pide el enunciado. Las opciones 2-6 no leen su contenido: trabajan con JSON.

El menú se imprime antes de esperar la entrada. switch llama al método de cada opción. La opción 0 termina con return. Sin más entrada, break sale del bucle. El catch informa del error y permite continuar.

<!-- SALTO DE PAGINA -->

# Validar la entrada de consola

**Main.java · líneas 81-91**

```java
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
```
**Main.java · líneas 93-103**

```java
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
```
**Main.java · líneas 105-113**

```java
public static int leerAnio(Scanner scanner) {
    System.out.println("El año en que fue publicada:");
    int anio = leerNumero(scanner);
    while (anio <= 0) {
        System.out.println("Introduce un año mayor que cero:");
        anio = leerNumero(scanner);
    }
    return anio;
}
```

## La opción elegida ante un dato incorrecto

Se repite el mismo paso. Así no se pierde toda una operación por escribir mal el año. Esta decisión está comentada en Main.java.

nextLine() siempre consume una línea completa. trim() quita los espacios de los extremos. Integer.parseInt() comprueba que el número cabe en un int; leerAnio añade que sea mayor que cero. Si se termina la entrada, se informa y no se guarda una operación incompleta.

<!-- SALTO DE PAGINA -->

# Conversión inicial y listado

**Main.java · líneas 115-128**

```java
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
```

## Reconversión explícita

La opción 1 lee el XML con JDOM2 y escribe el Catalogo con Jackson. Si ya existe JSON, se pide confirmación porque volver a convertirlo reemplazaría los cambios que solo estén guardados en él.

Elegir n cancela sin escribir. No se migra automáticamente en cada arranque: así se conservan las altas y modificaciones del JSON al reiniciar.

**Main.java · líneas 130-137**

```java
public static void mostrarPeliculas(Catalogo catalogo) {
    if (catalogo.getPeliculas().isEmpty()) {
        System.out.println("No hay películas disponibles.");
    }
    for (Pelicula pelicula : catalogo.getPeliculas()) {
        System.out.println(pelicula);
    }
}
```

## Listado

La opción 2 llama primero a leerJSON y pasa su resultado a mostrarPeliculas. El for recorre las películas y println llama a su toString(). Si la lista está vacía, se informa.

**Pregunta habitual:** «¿Dónde se usa el XML después de migrar?»

Solo al solicitar otra conversión. El CRUD carga el JSON y no modifica el XML de origen. Al arrancar se comprueba que el XML exista por el requisito concreto del ejercicio.

<!-- SALTO DE PAGINA -->

# Buscar por ID · un dato no es una posición

**Main.java · líneas 139-146**

```java
public static Pelicula buscarPorId(Catalogo catalogo, int id) {
    for (Pelicula pelicula : catalogo.getPeliculas()) {
        if (pelicula.getId() == id) {
            return pelicula;
        }
    }
    return null;
}
```
**Main.java · líneas 148-157**

```java
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
```

## Una búsqueda compartida

buscarPorId recorre la lista y compara el ID de cada objeto con el número solicitado. Devuelve la primera película encontrada. Si no coincide ninguna, devuelve null.

Los métodos de buscar, modificar y eliminar utilizan esta misma búsqueda. Así se evita repetir el recorrido en cada operación.

## Por qué no se usa get(id)

List.get recibe una posición que empieza por cero, no el identificador de una película. Los IDs pueden tener huecos y no tienen por qué coincidir con el índice.

En este catálogo no hay ID 3, pero la lista sigue teniendo un tercer elemento. Pedir get(3) consultaría la cuarta posición y podría devolver una película completamente distinta.

**Para el oral:** «El ID identifica el registro. El índice solo dice dónde está colocado en la lista. Los comparo recorriendo getId(), porque al borrar quedan huecos».

Si el ID no existe, se informa y se vuelve al menú. Como no se llama a guardarJSON, el fichero queda intacto.

<!-- SALTO DE PAGINA -->

# Añadir · calcular el ID y persistir

**Main.java · líneas 159-179**

```java
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
```

## Máximo existente más uno

idMaximo empieza en cero. El recorrido conserva el mayor identificador de la lista. Si no hay películas, sigue valiendo cero y la primera recibe ID 1.

| IDs existentes | Próximo ID |
| --- | --- |
| Ninguno | 1 |
| 1, 2, 5 | 6 |
| 1, 2 tras borrar el 5 | 3 |
| Catálogo de entrega, máximo 47 | 48 |

No se utiliza size() + 1, porque los huecos podrían hacer que ese número ya estuviera ocupado. No se conserva un máximo histórico: el enunciado de esta actividad pide el máximo existente.

## Cuándo se incorpora y se guarda

Primero se solicitan y validan todos los datos. Después se crea la Pelicula y se añade a la lista. guardarJSON persiste el catálogo completo. El mensaje con el ID asignado aparece solo si el guardado termina correctamente.

Integer.MAX_VALUE evita que sumar uno al mayor int provoque un desbordamiento y genere un ID incorrecto.

<!-- SALTO DE PAGINA -->

# Modificar · cambiar el objeto encontrado

**Main.java · líneas 181-200**

```java
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
```

## Qué objeto cambia

buscarPorId devuelve el objeto que está dentro de la lista del Catalogo. Los setters cambian ese mismo objeto; no hace falta eliminarlo y volverlo a añadir.

Se muestran sus valores actuales antes de pedir los nuevos. Se solicitan título, director, año y género. El ID se mantiene.

## Por qué se leen primero todos los campos

Los datos se guardan en variables locales. Los setters se ejecutan después de tener todos los valores válidos. Así, una entrada interrumpida no deja aplicada solo la mitad de la modificación.

Una vez actualizado el objeto, se vuelve a escribir el Catalogo completo. Si el ID no existe, return termina el método antes de pedir datos o guardar.

**Pregunta habitual:** «¿Un setter modifica automáticamente el fichero?»

No. Un setter cambia el objeto que está en memoria. El fichero se actualiza cuando se llama a guardarJSON. Sin esa llamada, el siguiente arranque recuperaría los datos anteriores.

<!-- SALTO DE PAGINA -->

# Eliminar · borrado físico y errores controlados

**Main.java · líneas 202-215**

```java
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
```

## Borrado físico

Se muestra la película que se va a eliminar y se quita su objeto de la lista. Al serializar de nuevo el Catalogo, esa película ya no aparece en el array peliculas.

No hay una marca de borrado ni se renumeran los registros restantes. Eliminar un registro no cambia el ID de otra película.

## Qué ocurre con cada error

| Situación | Respuesta del programa |
| --- | --- |
| Falta XML al arrancar | Informar y terminar |
| Falta JSON | Indicar opción 1 y volver al menú |
| ID inexistente | Informar; no guardar |
| Texto vacío o año incorrecto | Pedir otra vez ese dato |
| Opción fuera del menú | Informar y volver al menú |
| Error al leer o guardar | Informar; no anunciar éxito |
| JSON corrupto o catálogo inválido | Informar y conservar el fichero |

IOException cubre los errores de entrada/salida y también JsonProcessingException, que deriva de ella. JDOMException cubre el análisis XML. NumberFormatException es una IllegalArgumentException; la lectura numérica la trata para repetir el paso.

<!-- SALTO DE PAGINA -->

# Guion de la demostración

## Preparar la ejecución

Desde Acces a dades:

```sh
./Actividad3JsonJackson/run.sh
```

Desde la propia carpeta del proyecto basta con ./run.sh. Se necesita un JDK 17 o superior. Se ha comprobado con Java 26 en macOS. No se necesita Internet: los JAR están incluidos.

## Secuencia para enseñar el funcionamiento

1. Opción 1: convertir el XML. Si pregunta por un JSON existente, explica que confirmarlo sustituye sus cambios por el XML original. Con la entrega inicial hay 45 películas.
2. Opción 2: mostrar todas. Explica la raíz peliculas, los cinco campos y que id y año son números en el JSON.
3. Opción 3: buscar el ID 1. Debe mostrar Interstellar y sus datos.
4. Opción 4: añadir «Prueba oral», «Director de prueba», 2026 y «Prueba». Con el catálogo inicial se asigna el ID 48. Anota el ID que realmente indique el programa.
5. Opción 0: salir. Ejecutar otra vez y buscar ese ID. Que siga existiendo demuestra persistencia.
6. Opción 5: modificar el registro de prueba y consultarlo otra vez.
7. Opción 6: borrarlo. Volver a buscarlo: ya no existe. Si abres el JSON, tampoco está en el array.
8. Opción 3: buscar 99999 para enseñar un error controlado. También puedes introducir opción 99 o un año no numérico.

## Antes de la presentación

```sh
./Actividad3JsonJackson/probar.sh
```

Las 15 pruebas usan copias temporales: migración, CRUD, reinicio, ID máximo y huecos, lista vacía, entradas inválidas, JSON/XML incorrectos, ausencias y un fallo de escritura por permisos. Incluyen que el menú reaparezca sin escribir a ciegas.

El JSON entregado conserva las 45 películas originales. Se probó el alta, modificación y borrado de un registro temporal sin dejarlo en el catálogo.

**No reconviertas el XML entre el alta y la comprobación del reinicio:** estarías sustituyendo el JSON y no demostrando que conserva los cambios.

<!-- SALTO DE PAGINA -->

# Preguntas del oral · fundamentos

## ¿Qué diferencia hay entre XML, JSON y los objetos Java?

XML y JSON son formas de representar los datos en un fichero. Pelicula y Catalogo son los objetos con los que trabaja el programa en memoria. JDOM2 permite leer la representación XML y Jackson convierte entre los objetos y su representación JSON.

## ¿Por qué usas JDOM2 si el ejercicio es de JSON?

Porque el catálogo inicial procede del XML de la práctica anterior y el enunciado exige JDOM2 para esa migración. Después, el CRUD funciona sobre JSON.

## ¿Qué hace ObjectMapper?

Lee JSON y crea objetos Java mediante readValue. En la otra dirección, writeValue transforma los objetos en JSON y lo escribe en un fichero.

## ¿Para qué sirve Catalogo.class?

Indica a Jackson la clase de destino al deserializar. Catalogo tiene una propiedad List<Pelicula>, que describe tanto el objeto raíz como los elementos de su array.

## ¿Por qué no has usado anotaciones?

El enunciado las prohíbe. Los getters/setters permiten trabajar con los objetos. En Java se utilizan anio, getAnio y setAnio; la estrategia de nombres de Jackson traduce anio a año al leer y escribir JSON.

## ¿Por qué no escribes directamente la lista?

Porque una lista produciría un array como raíz. El ejercicio exige un objeto raíz con la propiedad peliculas. Por eso se serializa Catalogo.

## ¿Qué hace writerWithDefaultPrettyPrinter?

Prepara una escritura legible, con sangría y saltos de línea. Los datos son los mismos, pero se pueden revisar fácilmente con un editor.

## ¿Dónde están las consultas y dónde la persistencia?

Main pide datos, busca y modifica los objetos. FicherosCatalogo lee los ficheros y guarda el resultado. Pelicula y Catalogo representan los datos. Esta separación evita mezclar el menú con la lógica de acceso a ficheros.

<!-- SALTO DE PAGINA -->

# Preguntas del oral · decisiones y repaso

## ¿Puede repetirse un ID que existió y se borró?

Sí, si al calcular el máximo existente más uno vuelve a salir ese número. Por ejemplo, con IDs 1 y 2, el siguiente es 3 aunque un 3 anterior se haya borrado. No puede duplicarse un ID que siga presente. Es el criterio del enunciado actual.

## ¿Qué diferencia hay entre borrar la lista y borrar un registro?

clear() vaciaría toda la colección. En el borrado del CRUD se usa remove(encontrada), que retira solo la película buscada. Después se persiste el catálogo completo.

## ¿Por qué no se pierden datos si falla un guardado?

Se escribe primero un temporal. El fichero anterior solo se sustituye cuando termina la escritura. Si falla la operación, se informa y no se anuncia éxito. La siguiente operación carga otra vez el catálogo del fichero conservado.

## ¿Qué pasa si un usuario edita JSON y lo deja mal?

Jackson detecta errores de sintaxis o de conversión. La validación también revisa campos, valores e IDs. Se informa del error y no se sobrescribe el documento con otro catálogo vacío.

## ¿El catch de IOException cubre los errores de Jackson?

Sí. JsonProcessingException deriva de IOException. El mismo bloque que trata entrada/salida captura esos errores de procesamiento JSON.

## ¿Qué hace falta para seguir el recorrido completo?

Abre añadirPelicula en Main: leerJSON -> validar y pedir datos -> máximo ID + 1 -> add -> guardarJSON. Después sigue guardarJSON: validar -> temporal -> Jackson -> sustitución -> limpieza. Ese recorrido explica entrada, objetos y persistencia.

## Repaso antes de entrar

- Sé describir la diferencia entre objeto raíz, lista y película.
- Sé localizar readValue, writeValue, buscarPorId y el cálculo del ID.
- Sé explicar cuándo se guarda y por qué un setter no basta.
- Puedo enseñar un reinicio, un cambio, un borrado y un error controlado.

## Material de referencia

Enunciado: EjercicioCRUDJACKSON.docx. Teoría: AccesoFicheros.pptx, diapositivas 74-81 (conceptos), 84-90 (POJO y lectura), 91-94 (escritura y formato) y 95-100 (cambios y guardado).

El estilo de explicación sigue los PDF U1 - E02 de productor-consumidor y sprites: conceptos previos, recorrido, código y explicación. Las decisiones de organización y las comprobaciones adicionales se corresponden con el código de este proyecto.
