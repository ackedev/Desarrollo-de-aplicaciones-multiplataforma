# Bibliotecas del proyecto

Se incluyen los JAR locales como en las actividades anteriores. `run.sh` usa `-cp 'lib/*'` para compilar y `-cp 'out:lib/*'` para ejecutar en macOS/Linux. En Windows, el separador de classpath es `;`.

| JAR | Versión | Uso |
| --- | --- | --- |
| jdom2-2.0.6.1.jar | 2.0.6.1 | Leer el XML inicial con SAXBuilder. Copiado de la biblioteca utilizada en Actividad 2. |
| jackson-databind-2.21.8.jar | 2.21.8 | ObjectMapper, conversión entre POJO y JSON. |
| jackson-core-2.21.8.jar | 2.21.8 | Motor de análisis y escritura que utiliza databind. |
| jackson-annotations-2.21.jar | 2.21 | Dependencia interna de databind. El programa no utiliza anotaciones de mapeo. |

Jackson es la línea 2.x, con los paquetes `com.fasterxml.jackson` usados en la presentación. `jackson-annotations` utiliza versión sin tercer número en esta línea. No se incluyen Gson, org.json, JSON-P, módulos XML de Jackson ni librerías de pruebas.

## Procedencia

- Proyecto oficial Jackson: https://github.com/FasterXML/jackson
- Descripción de databind y sus dependencias: https://github.com/FasterXML/jackson-databind/tree/2.21
- jackson-databind: https://repo.maven.apache.org/maven2/com/fasterxml/jackson/core/jackson-databind/2.21.8/
- jackson-core: https://repo.maven.apache.org/maven2/com/fasterxml/jackson/core/jackson-core/2.21.8/
- jackson-annotations: https://repo.maven.apache.org/maven2/com/fasterxml/jackson/core/jackson-annotations/2.21/
- JDOM2: https://www.jdom.org/

Los JAR conservan sus metadatos de licencia en META-INF. No se necesita Maven: esta tabla y los scripts documentan la configuración de dependencias incluida en el proyecto.
