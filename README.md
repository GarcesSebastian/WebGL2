# Canvex

canvex es una biblioteca ligera y flexible que simplifica el trabajo con Canvas 2D y WebGL2, ideal para juegos, simulaciones físicas, lienzos interactivos y más.

## Características Principales

*   **Renderizado Híbrido:** Soporte integrado para Canvas 2D y WebGL2, permitiendo combinar gráficos 2D tradicionales con el poder de WebGL.
*   **Orientada a Juegos y Simulaciones:** Diseñada pensando en el desarrollo de juegos, simulaciones físicas y aplicaciones gráficas interactivas.
*   **API de Escena 2D Intuitiva:**
    *   Crea y gestiona fácilmente primitivas gráficas (rectángulos, texto, y más por extender).
    *   Control de propiedades como posición, tamaño, rotación, colores, bordes, sombras y padding.
    *   Gestión de escena con sistema de capas (`layer`) para controlar el orden de renderizado.
*   **Sistema de Eventos:** Manejo de interacciones del usuario (clics, arrastre) directamente sobre las formas.
*   **TypeScript Nativo:** Escrita completamente en TypeScript, ofreciendo un fuerte tipado, autocompletado y una mejor experiencia de desarrollo.
*   **Arquitectura Modular:** Organizada para ser flexible y extensible.
*   **Optimización con Web Workers (Avanzado):** Utiliza Web Workers para delegar tareas de física y renderizado, mejorando el rendimiento en escenas complejas.
*   **Utilidad de Transformación:** Incluye una herramienta (`Transformer`) para la manipulación interactiva (mover/escalar) de grupos de objetos en un entorno de edición.
*   **Configuración de Calidad:** Permite ajustar la calidad del renderizado (`low`, `medium`, `high`) para balancear rendimiento y fidelidad visual.

## Instalación

Para instalar Canvex, utiliza npm o yarn:

```bash
npm install canvex
```

o

```bash
yarn add canvex
```

## Ejemplos de Uso

A continuación, se muestran algunos ejemplos básicos para comenzar a usar Canvex.

### 1. Inicialización de Canvex

Para usar Canvex, necesitarás dos elementos `<canvas>` en tu HTML: uno para el renderizado WebGL (si se usa) y otro para el renderizado 2D.

```html
<!-- En tu archivo HTML -->
<canvas id="canvas-webgl"></canvas>
<canvas id="canvas-2d"></canvas>
```

Luego, en tu TypeScript, puedes inicializar `WebGL2` (que maneja ambos contextos):

```typescript
import { WebGL2 } from 'canvex';

// Obtén tus elementos canvas del DOM
const canvasGL = document.getElementById('canvas-webgl') as HTMLCanvasElement;
const canvas2D = document.getElementById('canvas-2d') as HTMLCanvasElement;

// Inicializa la instancia de WebGL2 (Singleton)
// WebGL2.getInstance() también se puede usar para obtener la instancia después de la creación inicial.
const canvexEngine = new WebGL2(canvasGL, canvas2D);

// Configura la calidad (opcional, por defecto es 'low')
canvexEngine.setQuality('medium');

// Inicia el motor de renderizado
canvexEngine.start();
```

### 2. Crear y Dibujar un Rectángulo (`Rect2D`)

Una vez inicializado el motor, puedes crear formas 2D. `WebGL2` proporciona métodos de fábrica para esto.

```typescript
import { WebGL2, Rect2D } from 'canvex'; // Asegúrate de importar Rect2D si lo necesitas para tipado

// Asumiendo que canvexEngine ya está inicializado como en el ejemplo anterior
const engine = WebGL2.getInstance();

const miRectangulo: Rect2D = engine.createRect2D({
    position: { x: 50, y: 50 },
    width: 100,
    height: 75,
    background: 'blue',
    borderColor: 'darkblue',
    borderSize: 5,
    borderRadius: 10, // Esquinas redondeadas
    layer: 1 // Las formas con mayor 'layer' se dibujan encima
});

// Las formas se añaden automáticamente a la escena al crearlas con los métodos de fábrica.
// No necesitas llamar a un método 'addShape' explícitamente en este caso.
```
El rectángulo aparecerá en el `canvas-2d`.

### 3. Crear y Dibujar Texto (`Text2D`)

De manera similar, puedes crear y mostrar texto.

```typescript
import { WebGL2, Text2D } from 'canvex'; // Asegúrate de importar Text2D si lo necesitas para tipado

const engine = WebGL2.getInstance();

const miTexto: Text2D = engine.createText2D({
    position: { x: 200, y: 100 },
    text: "¡Hola, Canvex!",
    fontSize: "24px",
    fontFamily: "Arial",
    color: "green",
    background: "lightgray", // Fondo del cuadro de texto
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    layer: 2
});
```

### 4. Manejo Básico de Eventos

Puedes hacer que las formas reaccionen a eventos del mouse, como clics.

```typescript
import { WebGL2, Rect2D } from 'canvex'; // O la forma que estés usando

const engine = WebGL2.getInstance();

const rectanguloInteractivo: Rect2D = engine.createRect2D({
    position: { x: 100, y: 200 },
    width: 150,
    height: 50,
    background: 'red',
    layer: 1
});

rectanguloInteractivo.on('click', (event) => {
    console.log('¡Rectángulo clickeado!', event);
    // Cambia el color al hacer clic
    rectanguloInteractivo.set('background', 'purple');
});

// Para que una forma sea 'arrastrable' (draggable):
const rectanguloArrastrable: Rect2D = engine.createRect2D({
    position: { x: 300, y: 200 },
    width: 100,
    height: 100,
    background: 'orange',
    draggable: true, // Habilita el arrastre
    layer: 1
});

rectanguloArrastrable.on('dragmove', (event) => {
    console.log('Arrastrando el rectángulo:', event.x, event.y);
});

rectanguloArrastrable.on('dragend', (event) => {
    console.log('Terminó el arrastre en:', event.x, event.y);
});
```

### 5. Habilitar Físicas en una Forma

Canvex permite activar un comportamiento físico básico para las formas. Al habilitar la propiedad `physics`, la forma será afectada por la gravedad configurada en el motor y potencialmente otras interacciones físicas si se definen.

```typescript
import { WebGL2, Rect2D } from 'canvex';

const engine = WebGL2.getInstance();

const rectanguloConFisicas: Rect2D = engine.createRect2D({
    position: { x: 150, y: 30 }, // Posición inicial
    width: 50,
    height: 50,
    background: 'green',
    physics: true, // Habilita las físicas para esta forma
    collisionable: true, // Importante para interacciones con otros objetos y límites (si implementado)
    layer: 1
});

// Este rectángulo ahora caerá debido a la gravedad por defecto.
// El motor de físicas (que corre en un Web Worker) actualizará su posición.
// Puedes ajustar la gravedad global a través de métodos en Render2D si es necesario.
// engine.Render2D.setGravity(0.5); // Ejemplo para cambiar la gravedad

console.log('Rectángulo con físicas habilitadas:', rectanguloConFisicas);
```
Es importante notar que las interacciones complejas entre objetos con físicas (como colisiones y rebotes detallados) dependen de la implementación específica dentro del motor de físicas y cómo se configuran las formas (`collisionable`, tipo de forma para la colisión, etc.). La activación de `physics: true` es el primer paso para que una forma sea gestionada por el sistema de físicas.

Estos ejemplos deberían ayudarte a dar tus primeros pasos con Canvex. Explora las propiedades de `Shape2D` y las formas específicas (`Rect2D`, `Text2D`, etc.) para descubrir más funcionalidades. Para una comprensión detallada de todas las funcionalidades y tipos disponibles, consulta las definiciones de tipos (`dist/index.d.ts`) incluidas en el paquete.

## Contribuir

¡Las contribuciones son bienvenidas! Si deseas mejorar Canvex, por favor abre un issue para discutir tus ideas o envía un pull request a través de nuestro repositorio en GitHub: https://github.com/GarcesSebastian/WebGL2.

## Licencia

Canvex se distribuye bajo la licencia MIT.