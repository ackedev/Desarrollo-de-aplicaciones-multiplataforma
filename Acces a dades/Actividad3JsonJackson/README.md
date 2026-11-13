# Actividad 3 - Catálogo de películas con Jackson

Aplicación Java de consola conforme a `EjercicioCRUDJACKSON.docx`. Migra el XML de Actividad 2 con JDOM2 y realiza las consultas y cambios exclusivamente sobre JSON mediante Jackson. No usa MVP, base de datos, anotaciones de mapeo ni otras bibliotecas JSON.

## Ejecutar

Se necesita un JDK 17 o superior. Comprobado con Java 26 en macOS.

Desde la carpeta Acces a dades:

```sh
./Actividad3JsonJackson/run.sh
```

O desde esta carpeta:

```sh
./run.sh
```

El script compila en UTF-8 con los JAR locales de `lib/` y ejecuta `Main`. No hace falta Maven ni conexión a Internet. En VS Code también se ha añadido la ruta de estas bibliotecas a la configuración de Acces a dades. Para trabajar en el editor, abre Actividad3JsonJackson como carpeta independiente: las otras actividades también tienen clases Main y Pelicula.

Compilación y ejecución manuales desde esta carpeta:

```sh
mkdir -p out
javac -encoding UTF-8 -Xlint:all -cp 'lib/*' -d out Main.java Pelicula.java Catalogo.java FicherosCatalogo.java
java -cp 'out:lib/*' Actividad3JsonJackson.Main
```

## Menú

1. Convertir XML a JSON.
2. Mostrar todas las películas.
3. Buscar una película por ID.
4. Añadir una película.
5. Modificar una película por ID.
6. Eliminar una película por ID.
0. Salir.

El JSON ya se entrega migrado. La opción 1 permite repetir la migración y pide confirmación si el JSON existe: reconvertir sustituye los cambios del JSON por el catálogo del XML.

## Archivos y reutilización

- `Pelicula.java`: modelo de Actividad 1/2, adaptado a un POJO con constructor vacío, setters y propiedad Java `anio`, tal como exige el JSON. La estrategia de nombres de Jackson convierte `anio` en la clave JSON `año`, sin anotaciones de mapeo.
- `Catalogo.java`: contiene `List<Pelicula> peliculas`; representa el objeto raíz del JSON.
- `Main.java`: menú y operaciones. Reutiliza los métodos de lectura de números, texto y año de Actividad 2 y sus recorridos de búsqueda por ID. Cada operación carga un catálogo local desde JSON.
- `FicherosCatalogo.java`: lectura XML con JDOM2 reutilizada de Actividad 2 y lectura/escritura JSON con `ObjectMapper`. El patrón de guardado temporal también procede de Actividad 2.
- `Datos/peliculas.xml`: copia íntegra del XML actual de Actividad 2: 45 registros, máximo existente 47 y huecos en los IDs 3 y 41.
- `Datos/peliculas.json`: los mismos registros migrados. Se ha realizado un alta de prueba (48), una modificación y su borrado físico; por eso el catálogo final conserva las 45 películas originales sin registros de prueba.
- `lib/README.md`: versiones, función y procedencia de todas las dependencias.
- `tests/comprobar.py`: pruebas por consola; trabaja en carpetas temporales, sin alterar el catálogo de entrega.
- `output/pdf/guia-oral-jackson.pdf`: guía imprimible para preparar el oral.
- `documentacion/guia-oral-jackson.md`: versión editable de la guía.

No se ha copiado la lectura TXT ni el CRUD XML, porque el enunciado indica que ya no son necesarios. Las actividades anteriores no se han modificado.

## Decisiones y errores

- Un dato de consola inválido hace repetir **ese mismo paso**. Está comentado junto a `leerNumero()`.
- ID automático = máximo **existente** + 1; catálogo vacío = 1. Se permiten huecos. A diferencia de Actividad 2, no se conserva `ultimoId`; el enunciado de esta actividad utiliza otro criterio. Si se borra el máximo, ese número podrá asignarse de nuevo.
- El ID no es la posición de la lista: se busca comparando `getId()`.
- Sin XML al arrancar: avisa y sale. Sin JSON: indica usar la opción 1 y vuelve al menú.
- JSON malformado, campos vacíos/nulos, enteros inválidos o IDs duplicados: informa y no guarda. No se regenera automáticamente desde XML.
- Un ID inexistente en búsqueda, modificación o borrado no provoca escritura.
- Antes de guardar se valida el catálogo, se escribe un temporal con sangría mediante Jackson y después se sustituye el JSON. Si falla la escritura o sustitución, se informa y se conserva el anterior. No se mantiene un catálogo compartido modificado en memoria tras un fallo.
- Aplicación pensada para una única ejecución a la vez; no sincroniza ediciones de varios procesos.

## Comprobación automática

```sh
./probar.sh
```

Necesita Python 3, solo con biblioteca estándar. Compila las clases en una carpeta temporal y ejecuta 15 pruebas de migración, CRUD persistente, menú interactivo, IDs, validaciones, ausencias, JSON/XML inválidos, fin de entrada y fallo de guardado por permisos. La prueba de permisos se ha comprobado en macOS.

## Demostración para el oral

1. Opción 2: listar. Opción 3: buscar ID 1.
2. Opción 4: añadir `Prueba oral`, `Director de prueba`, año `2026`, género `Prueba`; con la entrega sin cambios asigna ID 48.
3. Salir y volver a ejecutar; buscar 48 para demostrar persistencia.
4. Opción 5: modificar 48. Consultarlo otra vez.
5. Opción 6: borrar 48. Buscarlo: ya no existe y no figura en el array JSON.
6. Opción 3: buscar ID 99999 como error controlado. También se puede introducir una opción 99 o un año no numérico.
7. Para demostrar la migración, utilizar la opción 1 al comienzo, sabiendo que reemplaza el JSON si se confirma. El XML conserva el catálogo de partida.

Base teórica: `AccesoFicheros.pptx`, diapositivas 74-100; el ejercicio elige POJO y prohíbe anotaciones aunque la presentación muestre otras alternativas.

Las cuatro clases pertenecen al paquete `Actividad3JsonJackson` para distinguirlas de Main y Pelicula de las actividades anteriores. El atributo Java es `anio`, con `getAnio()` y `setAnio()`; Jackson conserva la clave JSON `año`.
