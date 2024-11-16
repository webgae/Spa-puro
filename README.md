# SPA Blog con API de Blogger

Una aplicación web de página única (SPA) que integra la API de Blogger para mostrar posts de manera dinámica y elegante.

## Características

- Navegación SPA sin recarga de página
- Integración con API de Blogger
- Sistema de categorías
- Paginación de posts
- Visualización de posts individuales
- Diseño responsive
- Animaciones de transición entre páginas
- Header y footer modulares

## Tecnologías Utilizadas

- JavaScript Vanilla
- HTML5
- CSS3
- API de Blogger
- Sistema de módulos ES6

## Estructura del Proyecto
├── js/
│   ├── pages/
│   │   ├── home.js
│   │   ├── about.js
│   │   ├── contact.js
│   │   ├── blog.js
│   │   └── post.js
│   ├── app.js
│   ├── router.js
│   ├── blogger-api.js
│   └── main.js
├── css/
│   └── styles.css
├── header.html
├── footer.html
└── index.html

## Uso
-La navegación se realiza a través de los enlaces del menú
-En la sección Blog:
-Filtra posts por categorías
-Navega entre páginas de posts
-Haz clic en "Ver más" para leer el post completo
-Los posts individuales muestran:
-Título
-Fecha de publicación
-Contenido completo con imágenes
-Botón para volver al blog
-Personalización
-Puedes personalizar:

-Número de posts por página (POSTS_POR_PAGINA en blogger-api.js)
-Estilos visuales (css/styles.css)
-Contenido de páginas estáticas (archivos en js/pages/)
-Header y footer (header.html y footer.html)
