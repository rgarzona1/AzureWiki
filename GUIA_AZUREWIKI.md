# Guía de estudio de AzureWiki

## 1. Estructura del proyecto

AzureWiki conserva el proyecto React con Vite que ya existía. No se agregaron dependencias ni un sistema de rutas.

- `index.html` define el idioma español, los metadatos de la página y el elemento raíz donde se monta React.
- `public/favicon.svg` muestra una marca de nube y protección coherente con la identidad visual de AzureWiki.
- `src/main.jsx` es el punto de entrada: carga los estilos globales y monta `App` dentro de `#root`.
- `src/App.jsx` contiene la composición de la interfaz, el estado de navegación y los componentes de presentación.
- `src/data/articles.js` es el catálogo local de categorías y artículos, incluidas sus explicaciones y referencias.
- `src/index.css` contiene variables de color, reglas globales y estilos base.
- `src/App.css` contiene la distribución de la wiki, los componentes visuales y los ajustes responsive.
- `vite.config.js` mantiene la configuración existente de Vite y su complemento de React.
- `.oxlintrc.json` conserva las reglas existentes de Oxlint.
- `package.json` define los comandos para desarrollo, compilación, lint y previsualización.

## 2. Arquitectura de componentes

`App` coordina el estado de la pantalla y enlaza las piezas principales:

```text
App
├── Header
│   └── búsqueda y resultados
├── Sidebar
│   └── categorías y artículos de la categoría seleccionada
└── main-content
    ├── Breadcrumbs
    ├── HomePage
    │   ├── CategoryCard
    │   └── ArticleCard
    ├── CategoryPage
    └── ArticlePage
```

`Header` recibe el texto de búsqueda y sus resultados como propiedades; al seleccionar un resultado informa a `App`. `Sidebar` hace lo mismo para las categorías y artículos. `HomePage`, `CategoryPage` y `ArticlePage` presentan los datos y notifican las selecciones, sin duplicar la lógica de navegación.

`Icon` concentra los SVG sencillos usados en la interfaz. `CategoryCard` y `ArticleCard` reciben sus datos y una acción para reutilizar las mismas tarjetas en diferentes contextos.

## 3. Flujo de navegación

La navegación se controla con el estado de React dentro de `App`, sin recargar la página:

- **Inicio:** `showHome` limpia la selección de artículo y categoría.
- **Categoría:** `showCategory` conserva el identificador de categoría y muestra `CategoryPage`.
- **Artículo:** `showArticle` guarda el artículo y su categoría; `ArticlePage` representa el contenido individual.
- **Regreso:** las migas de pan, el botón de fin de artículo y la navegación lateral permiten volver a la categoría o al inicio.

El mismo estado determina qué artículo aparece seleccionado en la barra lateral y qué ruta se muestra en las migas de pan. La búsqueda abre un artículo mediante el mismo flujo de selección.

## 4. Organización de los datos

`src/data/articles.js` exporta dos arreglos:

- `categories` contiene identificador, nombre, icono, descripción e identificadores de artículos.
- `articles` se construye a partir del catálogo de artículos y agrega a cada registro el nombre visible de su categoría y una estimación de lectura.

Cada artículo tiene un identificador estable, su categoría, título, introducción, explicación, características, importancia, ejemplo, relaciones, palabras clave y referencias oficiales. Las páginas filtran el arreglo por `categoryId`; la barra lateral y las tarjetas reutilizan esos mismos objetos. Para agregar un artículo, se incorpora un registro y su identificador a la categoría correspondiente.

## 5. Buscador

El buscador de `Header` consulta el arreglo `articles`; no requiere backend. `App` calcula los resultados con `useMemo` cuando cambia el texto ingresado. Normaliza el texto con minúsculas en español y busca una subcadena en el título, categoría, palabras clave e información explicativa del artículo.

Los resultados aparecen debajo del campo. Al elegir uno, se llama a `showArticle` y se limpia el campo. Si no hay coincidencias, se muestra un mensaje en el desplegable.

## 6. Estilos y responsive

Los estilos compartidos están en `src/index.css` y los componentes de AzureWiki en `src/App.css`. Las variables `--charcoal-blue`, `--charcoal`, `--taupe-grey`, `--dusty-olive` y `--sage-green` representan la paleta indicada; las superficies claras, bordes y fondos de apoyo se construyen con transparencias y tonos neutros derivados.

En pantallas amplias, `workspace` ubica la barra lateral junto al contenido; el encabezado y la barra lateral permanecen visibles al desplazarse. Las tarjetas usan cuadrículas que reducen columnas en tablet y pasan a una columna en móviles pequeños. En móvil, la barra lateral se convierte en una fila desplazable de categorías; al seleccionar una, el área principal muestra una lista legible de sus artículos. Las consultas CSS están al final de `src/App.css`.

## 7. Flujo de renderizado

Vite sirve `index.html` y carga `src/main.jsx` como módulo. `main.jsx` importa `src/index.css`, crea el punto de montaje React con `createRoot` y renderiza `App` dentro de `StrictMode`. `App` lee los arreglos locales, representa el inicio y actualiza la vista ante selecciones de categoría, artículo o búsqueda. Los estilos de `src/App.css` dan formato a esa interfaz.

## 8. Cómo ejecutar y validar

Los comandos definidos en `package.json` son:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

`npm run dev` inicia Vite en modo desarrollo. `npm run build` crea la compilación de producción. `npm run lint` ejecuta Oxlint con la configuración del proyecto. `npm run preview` permite previsualizar localmente la compilación.

## 9. Ejercicios para continuar aprendiendo

1. Añadir una categoría con su icono, descripción y artículos.
2. Crear artículos nuevos con todas las secciones del esquema de datos existente.
3. Implementar filtros por tipo de servicio o nivel de dificultad.
4. Agregar favoritos locales y una vista para consultarlos.
5. Incorporar un modo oscuro respetando las variables de tema.
6. Crear un índice de contenidos por secciones dentro de cada artículo.
7. Añadir una página que agrupe recursos oficiales de Microsoft Learn.
