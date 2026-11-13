# Plan de implementación del arranque

Objetivo: ejecutar una única pantalla MyPlaces blanca y azul en web e iOS.
Referencia: PLAN.md. Implementación directa en la carpeta solicitada, sin commits.

- [x] Crear package.json con Expo Router como entrada y scripts start, ios y web.
- [x] Configurar app.json, ignorar dependencias y archivos generados.
- [x] Crear constants/colors.js, app/_layout.jsx y app/index.jsx sin lógica de lugares.
- [x] Instalar con pnpm y comprobar compatibilidad con Expo.
- [x] Compilar para web e iOS; comprobar pantalla web e iOS simulado.
- [x] Documentar comandos, resultados y límites; detenerse antes del ejercicio de navegación.

Comprobaciones: entrada del router, resolución de dependencias, ambas plataformas
y legibilidad de la pantalla inicial. No añadir tests que repitan JSX estático.
No hay datos de usuario, llamadas remotas ni permisos en este paso.

Resultado: exportación web/iOS correcta, `expo install --check` correcto con
mapa local de versiones y `pnpm peers check` sin problemas. Pantalla visible
en navegador y simulador iPhone Duo. Sin prueba en iPhone físico.
