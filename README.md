# Canvex

[![NPM Version](https://img.shields.io/npm/v/canvex.svg)](https://www.npmjs.com/package/canvex)
[![Licencia](https://img.shields.io/npm/l/canvex.svg)](https://github.com/GarcesSebastian/radial-js/blob/main/LICENSE)
[![Tamaño del Paquete](https://img.shields.io/bundlephobia/minzip/canvex.svg)](https://bundlephobia.com/package/canvex)
[![Descargas Mensuales NPM](https://img.shields.io/npm/dm/canvex.svg)](https://www.npmjs.com/package/canvex)
[![Estado del Build (Ejemplo)](https://img.shields.io/travis/com/GarcesSebastian/radial-js.svg?branch=main)](https://travis-ci.com/github/GarcesSebastian/radial-js) 
<!-- El badge de Travis CI es un ejemplo; necesitarás configurar CI/CD para que funcione. -->

Canvex es una biblioteca ligera y flexible que simplifica el trabajo con Canvas 2D y WebGL2, ideal para juegos, simulaciones físicas, lienzos interactivos y más.

## Visión General / ¿Qué es Canvex?

Canvex es una biblioteca de gráficos 2D escrita en TypeScript, diseñada para facilitar la creación de experiencias interactivas en el navegador. Proporciona una API intuitiva para dibujar y gestionar objetos en un lienzo HTML5, manejar eventos del usuario, aplicar físicas básicas y organizar tu escena gráfica. Su arquitectura híbrida está preparada para combinar renderizado Canvas 2D con WebGL2, ofreciendo flexibilidad para diversos proyectos como:

*   Juegos 2D casuales o con físicas.
*   Simulaciones interactivas.
*   Visualizaciones de datos dinámicas.
*   Herramientas de dibujo y edición gráfica sencillas.

## Características Principales

*   **Renderizado Híbrido:** Soporte integrado para Canvas 2D y WebGL2, permitiendo combinar gráficos 2D tradicionales con el poder de WebGL. (Nota: El renderizado WebGL específico requiere implementación por parte del usuario en la versión actual).
*   **Orientada a Juegos y Simulaciones:** Diseñada pensando en el desarrollo de juegos, simulaciones físicas y aplicaciones gráficas interactivas.
*   **API de Escena 2D Intuitiva:**
    *   Crea y gestiona fácilmente primitivas gráficas (rectángulos, texto, y más por extender).
    *   Control de propiedades como posición, tamaño, rotación, colores, bordes, sombras y padding.
    *   Gestión de escena con sistema de capas (`layer`) para controlar el orden de renderizado.
*   **Sistema de Eventos:** Manejo de interacciones del usuario (clics, arrastre) directamente sobre las formas.
*   **TypeScript Nativo:** Escrita completamente en TypeScript, ofreciendo un fuerte tipado, autocompletado y una mejor experiencia de desarrollo.
*   **Arquitectura Modular:** Organizada para ser flexible y extensible.
*   **Optimización con Web Workers (Avanzado):** Utiliza Web Workers para delegar tareas de física y renderizado (esta última de forma interna), mejorando el rendimiento en escenas complejas.
*   **Utilidad de Transformación:** Incluye una herramienta (`Transformer`) para la manipulación interactiva (mover/escalar) de grupos de objetos en un entorno de edición.
*   **Configuración de Calidad y Rendimiento:** Permite ajustar la calidad del renderizado (`low`, `medium`, `high`) y activar un monitor de FPS y conteo de objetos para depuración.

## Instalación

Para instalar Canvex, utiliza npm o yarn:

```bash
npm install canvex
```

o

```bash
yarn add canvex
```

## Primeros Pasos / Guía Rápida

Esta es la forma más básica de poner Canvex en funcionamiento:

1.  **Prepara tu HTML:** Necesitarás dos elementos `<canvas>`.
    ```html
    <!-- En tu archivo HTML -->
    <canvas id="canvas-webgl"></canvas> <!-- Para futuro uso con WebGL -->
    <canvas id="canvas-2d"></canvas>   <!-- Para todo el renderizado 2D -->
    ```

2.  **Inicializa el Motor en TypeScript:**
    ```typescript
    import { WebGL2 } from 'canvex';

    // Obtén tus elementos canvas del DOM
    const canvasGL = document.getElementById('canvas-webgl') as HTMLCanvasElement;
    const canvas2D = document.getElementById('canvas-2d') as HTMLCanvasElement;

    // Inicializa la instancia de WebGL2
    const engine = new WebGL2(canvasGL, canvas2D);

    // Crea una forma simple
    engine.createRect2D({
        position: { x: 50, y: 50 },
        width: 100,
        height: 100,
        background: 'teal'
    });

    // Inicia el motor de renderizado
    engine.start();
    ```
    ¡Deberías ver un cuadrado turquesa en tu `canvas-2d`!

## Guía Detallada y Ejemplos de Uso

### 8.1. Configuración del Motor

La instancia de `WebGL2` te permite configurar ciertos aspectos del motor y obtener información sobre su estado.

#### Habilitar el Monitor de Rendimiento (FPS y Conteo de Objetos)
Puedes activar un monitor de rendimiento visual que muestra los FPS actuales y el número de objetos en la escena 2D. Esto se controla mediante la opción `logs` en el método `setConfig`.

```typescript
import { WebGL2 } from 'canvex';

const engine = WebGL2.getInstance(); // Asumiendo que ya ha sido inicializado

// Habilitar el monitor de rendimiento
engine.setConfig({ logs: true });

// Para deshabilitarlo más tarde
// engine.setConfig({ logs: false });
```
Cuando `logs: true`, verás un pequeño panel en la esquina superior izquierda de tu `canvas-2d` mostrando los FPS y el conteo de objetos. El color del panel cambia según el rendimiento.

#### Ajustar la Calidad del Renderizado
Canvex permite tres niveles de calidad: `'low'`, `'medium'`, y `'high'`.

```typescript
import { WebGL2, Quality } from 'canvex'; // Importa el tipo Quality

const engine = WebGL2.getInstance();

engine.setConfig({ quality: 'medium' }); // Por defecto es 'low'
// Opciones: 'low', 'medium', 'high'
```
Efectos de la calidad:
*   **`low`**: Puede deshabilitar el suavizado de imágenes, reducir la frecuencia de actualización de efectos visuales. Sombras en `Shape2D` podrían estar desactivadas/mínimas.
*   **`medium`**: Equilibrio entre calidad y rendimiento. Suavizado de imágenes activo, efectos visuales moderados.
*   **`high`**: Prioriza calidad visual. Suavizado activo, efectos visuales de mayor fidelidad (ej. sombras).

#### Obtener la Configuración Actual y FPS
```typescript
import { WebGL2 } from 'canvex';

const engine = WebGL2.getInstance();

const currentConfig = engine.getConfig();
console.log('Configuración actual:', currentConfig); // { quality: '...', logs: ... }

const currentFPS = engine.getFPS();
console.log('FPS actuales:', currentFPS);
```

### 8.2. Creando y Dibujando Formas 2D

Todas las formas 2D heredan de `Shape2D` y comparten un conjunto común de propiedades además de las específicas de cada forma.

**Propiedades Comunes de `Shape2D` (Ejemplos):**
*   `position: { x: number, y: number }`
*   `width: number | "auto"`, `height: number | "auto"`
*   `rotation: number` (grados)
*   `background: string` (color CSS)
*   `borderColor: string`, `borderSize: number`
*   `borderRadius: number`
*   `shadowColor: string`, `shadowBlur: number`, `shadowOffsetX: number`, `shadowOffsetY: number`
*   `paddingTop: number`, `paddingRight: number`, `paddingBottom: number`, `paddingLeft: number`
*   `layer: number` (para orden de dibujado, mayor encima)
*   `visible: boolean`
*   `draggable: boolean` (ver sección de eventos)
*   `physics: boolean` (ver sección de físicas)
*   `collisionable: boolean`
*   `ignorable: boolean` (ignorado por eventos de ratón si es true)

#### Rectángulos (`Rect2D`)
```typescript
import { WebGL2, Rect2D } from 'canvex';
const engine = WebGL2.getInstance();

const miRect: Rect2D = engine.createRect2D({
    position: { x: 50, y: 50 },
    width: 150,
    height: 100,
    background: 'rgba(0, 0, 255, 0.5)', // Azul semitransparente
    borderColor: 'navy',
    borderSize: 3,
    borderRadius: 15,
    shadowColor: 'black',
    shadowBlur: 10,
    shadowOffsetX: 5,
    shadowOffsetY: 5,
    layer: 1
});
```

#### Texto (`Text2D`)
Además de las propiedades comunes, `Text2D` tiene:
*   `text: string`
*   `fontSize: string` (ej. "20px")
*   `fontFamily: string` (ej. "Arial")
*   `fontWeight: string` (ej. "bold")
*   `fontStyle: string` (ej. "italic")
*   `fontVariant: string` (ej. "small-caps")
*   `color: string` (color del texto)
*   `textAlign: CanvasTextAlign` (ej. "center")
*   `textBaseline: CanvasTextBaseline` (ej. "middle")
*   `textDirection: CanvasDirection` (ej. "ltr")
*   `spacingY: number` (espacio vertical entre líneas de texto)
*   `spacingX: number` (no usado comúnmente, revisar utilidad)

```typescript
import { WebGL2, Text2D } from 'canvex';
const engine = WebGL2.getInstance();

const miTexto: Text2D = engine.createText2D({
    position: { x: 250, y: 100 },
    text: "Canvex en Acción
¡Múltiples Líneas!",
    fontSize: "28px",
    fontFamily: "Verdana",
    color: "purple",
    background: "rgba(200, 200, 200, 0.7)",
    paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15,
    borderRadius: 8,
    textAlign: 'center',
    textBaseline: 'middle',
    spacingY: 8,
    layer: 2,
    shadowColor: 'gray',
    shadowBlur: 5
});
```
*Se planea añadir más formas como Círculos, Líneas y Polígonos en futuras versiones.*

### 8.3. Manejo de Eventos

Puedes hacer que las formas reaccionen a eventos del mouse.

```typescript
// (Continuación del ejemplo de miRect de arriba)
miRect.on('click', (event) => {
    console.log('Rectángulo clickeado!', event);
    miRect.set('background', 'crimson');
});

miRect.on('mousedown', (event) => console.log('Mouse Abajo sobre miRect:', event));
// Otros eventos: 'mouseup', 'mousemove'

// Para que una forma sea 'arrastrable' (draggable):
const rectArrastrable = engine.createRect2D({
    position: { x: 50, y: 200 }, width: 120, height: 70,
    background: 'lightcoral', draggable: true, layer: 0
});

rectArrastrable.on('dragstart', (event) => console.log('Inicio de arrastre:', event));
rectArrastrable.on('dragmove', (event) => {
    console.log('Arrastrando:', event.x, event.y);
    // La posición de rectArrastrable se actualiza automáticamente
});
rectArrastrable.on('dragend', (event) => console.log('Fin de arrastre:', event));
```

### 8.4. Físicas Básicas

```typescript
// (Continuación del ejemplo de miTexto de arriba)
miTexto.set('physics', true); // ¡Ahora el texto caerá!
miTexto.set('collisionable', true); // Para interactuar con límites del canvas

// Los objetos con `physics: true` son afectados por la gravedad global (hacia abajo)
// y rebotan en los límites del canvas.
// La intensidad de la gravedad es un valor interno (0.8) y no es configurable en tiempo de ejecución
// en la versión actual. Puedes verla con: engine.Render2D.getGravity().
```

### 8.5. Utilidad `Transformer` (Manipulación de Objetos)

Canvex incluye una utilidad `Transformer` para la manipulación interactiva de grupos de formas 2D.

```typescript
import { WebGL2, Rect2D, Transformer } from 'canvex'; // Asegúrate de importar Transformer
const engine = WebGL2.getInstance();

const forma1 = engine.createRect2D({ position: {x:400, y:50}, width:80, height:80, background:'skyblue'});
const forma2 = engine.createRect2D({ position: {x:500, y:100}, width:50, height:100, background:'salmon'});

const transformer: Transformer = engine.createTransformer2D();
transformer.add(forma1);
transformer.add(forma2);
transformer.show(); // Muestra los controles para mover/escalar el grupo

// Arrastra el recuadro central del transformer para mover las formas juntas.
// Los nodos en las esquinas/lados están diseñados para escalado (funcionalidad en desarrollo).
```

### 8.6. Renderizado: `Render2D` vs `RenderGL`

Canvex inicializa dos contextos de renderizado:
*   **`Render2D`**: Asociado con tu `canvas-2d`. Todas las formas 2D (`Rect2D`, `Text2D`, etc.), sus eventos y físicas operan aquí usando la API Canvas 2D estándar.
*   **`RenderGL`**: Asociado con tu `canvas-webgl`. Prepara un contexto WebGL2. **Importante:** En la versión actual, `RenderGL` no implementa rutinas de dibujo WebGL personalizadas por defecto. Su propósito es estructural y para futuras extensiones o implementación directa por usuarios avanzados que deseen escribir su propia lógica de renderizado WebGL.

## Características Futuras y Hoja de Ruta (Roadmap)

Canvex es un proyecto en desarrollo activo y hay varias mejoras y nuevas funcionalidades planificadas:

### Implementación de Spatial Grid
*   **Descripción:** Una cuadrícula espacial para optimizar drásticamente la detección de colisiones y consultas espaciales en escenas con muchos objetos.
*   **Estado:** Planificado.

### Mejoras en el Motor de Renderizado WebGL (`RenderGL`)
*   **Descripción:** Implementar rutinas de renderizado WebGL más robustas (sprites, texturas, shaders personalizados, batch rendering).
*   **Estado:** En consideración.

### Ampliación de Formas 2D y Primitivas
*   **Descripción:** Añadir más tipos de formas 2D predefinidas (Círculos/Elipses, Líneas, Polígonos, Curvas).
*   **Estado:** En consideración.

### Sistema de Animación Avanzado
*   **Descripción:** Un sistema dedicado para crear y controlar animaciones de propiedades (timelines, easing).
*   **Estado:** Idea preliminar.

### Documentación y Ejemplos Adicionales
*   **Descripción:** Continuar mejorando la documentación con más tutoriales y ejemplos.
*   **Estado:** Continuo.

### ¡Tu Contribución es Importante!
La hoja de ruta es flexible. Participa con ideas o contribuciones en [Issues en GitHub](https://github.com/GarcesSebastian/radial-js/issues).

## Contribuir

¡Las contribuciones son bienvenidas! Si deseas mejorar Canvex, por favor abre un issue para discutir tus ideas o envía un pull request a través de nuestro repositorio en GitHub: https://github.com/GarcesSebastian/radial-js. Considera seguir prácticas de código estándar y añadir pruebas si es aplicable.

## Licencia

Canvex se distribuye bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.
