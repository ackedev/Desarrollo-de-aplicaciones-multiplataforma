# MyPlaces

Práctica 2 de Programación multimedia y dispositivos móviles. Aplicación con
React Native, Expo SDK 58 y JavaScript para guardar lugares y ciudades.

## Instalación y ejecución

Requisitos: Node.js compatible con Expo SDK 58 y pnpm. En el desarrollo se han
utilizado Node.js 24 y pnpm 12.18.0. Para el simulador iOS se necesita Xcode.

Desde la carpeta del proyecto:

```bash
pnpm install
pnpm run web
```

Para abrir el simulador:

```bash
pnpm run ios
```

En la terminal de Expo, `Shift+i` permite elegir el iPhone 18 Pro. Un mismo servidor
sirve web e iOS; `w` abre la versión web. Para un iPhone físico, ejecutar `pnpm start`,
conectar el Mac y el móvil a la misma red y abrir el QR con Expo Go compatible con
SDK 58. Si el puerto está ocupado, utilizar el que indique Expo.

## Pantallas y estructura

- `app/index.jsx`: Mis lugares, lista de favoritos y acceso al detalle.
- `app/descobreix.jsx`: Descubre, ubicación y búsqueda de lugares cercanos.
- `app/mis-ciudades.jsx` y `app/ciutats.jsx`: ciudades guardadas y búsqueda de ciudades.
- `app/afegir.jsx`: formulario con validación del nombre.
- `app/detall/[id].jsx`: detalle, resumen de Wikipedia y eliminación.
- `app/_layout.jsx`: navegación y elementos compartidos.
- `components/`: tarjetas reutilizables, navegación inferior y estado de conexión.
- `context/PlacesContext.jsx`: lista compartida y estado de red con NetInfo.
- `storage/placesStorage.js`: lectura y escritura con AsyncStorage.
- `services/`: consultas a las APIs.

Los lugares se recuperan al abrir la app. Se pueden añadir, eliminar y guardar
desde Descubre sin repetir su identificador. Las ciudades aparecen en su apartado
con la temperatura automática. Los resúmenes de Wikipedia se guardan como descripción.

## APIs utilizadas

Todas las consultas se realizan con `fetch` mediante HTTPS y no requieren clave:

- [Wikipedia GeoSearch](https://www.mediawiki.org/wiki/API:Geosearch) y
  [TextExtracts](https://www.mediawiki.org/wiki/Extension:TextExtracts): artículos
  cercanos y resúmenes. Se buscan 30 candidatos a 2 km y se muestran hasta 10 lugares.
- [Wikidata](https://www.mediawiki.org/wiki/Wikibase/API): clasificación de artículos
  para conservar tipos de lugares visitables y sus subtipos inmediatos.
- [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api): búsqueda de ciudades.
- [Open-Meteo Forecast](https://open-meteo.com/en/docs): temperatura actual.

Las pantallas muestran carga, errores y resultados vacíos. Se incluye la fuente
de los datos; el detalle de Wikipedia enlaza el artículo y su licencia.

## Permisos y conectividad

Descubre pide ubicación en primer plano al pulsar **Buscar cerca de mí**. Muestra
latitud y longitud y busca los lugares automáticamente. Si se deniega el permiso,
informa del problema y mantiene disponibles los demás apartados. Si el permiso
está bloqueado en iOS o Android, ofrece abrir los ajustes de la app. Con Expo Go
se abren sus ajustes. En web el permiso se cambia desde los ajustes del sitio.

NetInfo muestra si hay conexión y, cuando está disponible, el tipo de red. Sin
conexión se bloquean las consultas remotas; los datos ya guardados y el formulario
siguen disponibles. Al recuperar la conexión, las temperaturas y los resúmenes
pendientes se vuelven a consultar.

## Cinco pruebas manuales

| Caso | Resultado esperado | Resultado obtenido y entorno |
| --- | --- | --- |
| Creación | Rechazar un nombre vacío y añadir un nombre válido. | Aparece el aviso y se guarda «Parque de prueba». Simulador iPhone 18 Pro. |
| Reinicio | Recuperar los lugares al cerrar y volver a abrir la app. | «Parque de prueba» reaparece tras cerrar Expo Go desde el selector de apps y reabrir MyPlaces. Simulador. |
| Ausencia de datos | Mostrar el mensaje de lista vacía sin errores. | Mensaje correcto en una sesión web aislada sin datos iniciales. |
| Error de red | Mostrar el estado sin conexión y evitar consultas. | Aviso de NetInfo y búsqueda deshabilitada con la desconexión simulada en web. |
| Permiso denegado | Mostrar un aviso y permitir usar el resto de la app. | Aviso correcto y acceso a Mis lugares con una respuesta de permiso denegado simulada en web. |

Las pruebas web usan una sesión de comprobación aislada, con estados simulados,
sin cambiar la red del Mac ni borrar los datos del simulador. También se ha
confirmado en iPhone físico el funcionamiento de la ubicación y la persistencia.

## Limitaciones

- Se ha probado en web, simulador iPhone 18 Pro con iOS 27.2 e iPhone físico.
  Android no se ha probado y no se ha generado un APK ni una versión de distribución.
- Cada instalación y navegador tiene sus propios datos locales.
- Las consultas externas necesitan Internet; el tipo de red puede no aparecer en web.
- El filtro de Wikidata puede omitir lugares con una clasificación más específica.
- La ubicación es puntual, sin seguimiento en segundo plano.

## Evidencias

- [Memoria en PDF](output/pdf/MyPlaces_Memoria.pdf).
- [Capturas de las pantallas y pruebas](docs/entrega/capturas/).
