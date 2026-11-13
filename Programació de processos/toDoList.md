# Pendientes: simulador de productores y consumidores con MVP

## Cómo vamos a trabajar

- El estudiante escribe el código. El asistente guía con un único paso pequeño, revisa y explica.
- Dar primero pistas concretas; mostrar la solución si no consigue resolverlo o la pide.
- No implementar el proyecto entero ni adelantar clases o funcionalidades.
- Al verificar un paso, eliminarlo de los pendientes y actualizar las notas de los siguientes.
- Mantener las clases y patrones sencillos del proyecto. No hacer commits sin petición.

## Base actual y reglas

- Proyecto Java: `ModelFils`. El estudiante ha elegido carpetas `Model`, `View` y `Presenter` con mayúscula; conservar esos nombres.
- Existen `Main`, `Model`, `Producer`, `Consumer` y `Resource`.
- Carpetas `ModelFils/Model`, `ModelFils/View` y `ModelFils/Presenter` verificadas.
- `IPresenter` y `Presenter` usan `ModelFils.Presenter`; `Presenter` implementa `execute()` y ambos archivos compilan. Falta conectar el modelo.
- Paquetes del modelo unificados como `ModelFils.Model` e import de `Main` corregido. Compilación completa y ejecución verificadas: salida `0`.
- `St` apunta a `Viewer`, dentro de View. Su significado sigue sin conocerse; queda pendiente, sin bloquear los pasos independientes.
- Actualmente hay un productor y un consumidor, con 10.000 operaciones cada uno.
- Los dos modifican el mismo recurso con métodos `synchronized`; `Model` espera con `join()` antes de imprimir.
- Un hilo por productor y un hilo por consumidor. Cada hilo realiza sus operaciones sucesivamente; distintos hilos pueden trabajar concurrentemente.
- Con distintas cantidades producidas y consumidas, el resultado final no tiene por qué ser cero.
- La sincronización evita perder actualizaciones; el control de stock impone límites. Son opciones distintas.

## Pasos pendientes

1. Acordar el reparto MVP y los nombres del diagrama.
   - Model: recursos, stock, productores, consumidores y ejecución.
   - View: interfaz, lectura de controles y presentación del estado.
   - Presenter: recibe acciones de la vista y coordina el modelo y la vista.
   - Aclarar `St`: no inventar su significado ni crear una clase sin saber su función.
   - Confirmar qué representan `Viewer`, `ControlPanel` y `DataPanel` en el diagrama; propuesta: `Viewer` contiene los otros dos.
   - Confirmar Swing antes de construir la interfaz.
3. Introducir las interfaces y clases mínimas de MVP, una a una.
   - Siguiente ejercicio: añadir a `Presenter` una referencia privada de tipo `Model`, recibida por constructor. Importar `ModelFils.Model.Model`. Después conectar `execute()` por delegación.
   - Acordar los contratos necesarios para vista y modelo (`IView` / `IModel`) según el diagrama de clase.
   - Las interfaces declaran operaciones; las clases las implementan. No añadir métodos vacíos por anticipado.
4. Conectar `Main`, vista, presenter y modelo sin construir todavía todos los controles.
   - Evitar dependencias directas entre vista y modelo.
5. Definir estado y finalización.
   - Consulta: View → Presenter → Model mediante `getStatus()`.
   - Aviso: Model → Presenter → View mediante `notifyEnd()`.
   - Concretar estados y tipo devuelto antes de implementar.
   - El aviso de fin debe corresponder al fin del conjunto de trabajadores, no al de uno solo.
6. Crear una vista mínima con Play, Stop y estado textual.
   - El «semáforo» comunica si la ejecución ha terminado; no dibujar un semáforo.
   - Si usamos Swing: no ejecutar bucles ni `join()` en el hilo de la interfaz; actualizar componentes en su hilo.
7. Acordar e implementar el comportamiento de Play y Stop.
   - Pendiente: Stop cancela, pausa o deja acabar la operación en curso.
   - Evitar arrancar otra simulación mientras la anterior siga activa.
   - Detener también trabajadores dormidos o esperando; no usar `Thread.stop()`.
8. Permitir configurar el número de productores y consumidores.
   - Crear un trabajador y un hilo por cada uno. Mantener seguimiento de todos para Stop y finalización.
9. Permitir varios tipos de recurso y mostrar sus existencias en `DataPanel`.
   - Empezar con hamburguesas como ejemplo.
   - Aclarar cómo se asigna o selecciona el tipo que produce/consume cada trabajador.
10. Añadir tiempos y cantidades configurables, de forma incremental.
    - Validar mínimos y máximos antes de empezar; acordar unidades de tiempo.
    - Aclarar si fijo/variable se refiere al tiempo, a la cantidad por operación o a otra cosa.
    - Aclarar cuándo se sortea una cantidad variable: al crear el trabajador o en cada operación.
11. Añadir sincronización opcional y control de stock.
    - Sincronización de producir/consumir: sí/no; sin ella se permiten carreras como demostración didáctica.
    - Control de stock: sí/no; límites mínimo/máximo y estrategia Sleep o Wait/notifyAll.
    - Aclarar si los límites se aplican por tipo de recurso o al total.
    - Definir qué combinaciones de opciones son válidas y qué pasa si ya no queda nadie que pueda desbloquear a un trabajador.
    - No dormir manteniendo el bloqueo del recurso. Con `wait()`, comprobar la condición en un bucle.
12. Verificar cada comportamiento y después el flujo completo.
    - Play → trabajo → fin; Play → Stop; nueva ejecución tras finalizar.
    - Varios trabajadores, recursos, cantidades limitadas/ilimitadas y ambas estrategias de stock.
    - Comprobar que la vista responde y que no quedan hilos bloqueados al detener.

## Controles que debe tener el panel al terminar

- Play y Stop.
- Número de productores, consumidores y tipos de recurso.
- Tiempo produciendo: mínimo y máximo.
- Tiempo consumiendo: mínimo y máximo.
- Recursos a producir por productor: ilimitados o mínimo/máximo.
- Recursos a consumir por consumidor: ilimitados o mínimo/máximo.
- Control de stock: sí/no.
- Tipo de control de stock: Sleep o Wait/notifyAll.
- Límite de recursos: mínimo/máximo.
- Sincronización para producir/consumir: sí/no.
- Consumo fijo/variable.
- Producción fija/variable.

## Siguiente paso en el chat

Guiar un atributo privado de tipo `Model` y un constructor de `Presenter` que reciba y guarde ese modelo. No modificar aún `Main` ni implementar la delegación hasta revisar este ejercicio. No escribir el código por el estudiante.
