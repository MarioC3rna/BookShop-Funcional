# Proyecto Tienda de Libros en Línea

Este proyecto es una tienda de libros en línea que permite a los usuarios explorar, agregar y comprar libros. La aplicación está construida utilizando HTML, CSS y JavaScript, y se conecta a una base de datos Neo4j para gestionar la información de los libros.

## Estructura del Proyecto

```
tienda-libros-online
├── src
│   ├── assets
│   │   ├── css
│   │   │   ├── main.css
│   │   │   └── normalize.css
│   │   ├── js
│   │   │   ├── app.js
│   │   │   ├── carrito.js
│   │   │   └── catalogo.js
│   │   └── img
│   ├── components
│   │   ├── header.js
│   │   ├── footer.js
│   │   └── libro-card.js
│   ├── database
│   │   ├── neo4j-config.js
│   │   ├── queries.js
│   │   └── models.js
│   ├── pages
│   │   ├── home.html
│   │   ├── catalogo.html
│   │   ├── detalle-libro.html
│   │   ├── carrito.html
│   │   └── checkout.html
│   └── models
│       └── libro.js
├── index.html
├── package.json
└── README.md
```

## Descripción de Archivos

- **src/assets/css/**: Contiene los archivos CSS para el estilo de la tienda.
  - `main.css`: Estilos principales.
  - `normalize.css`: Normaliza estilos entre navegadores.

- **src/assets/js/**: Contiene los scripts JavaScript.
  - `app.js`: Script principal de la aplicación.
  - `carrito.js`: Lógica del carrito de compras.
  - `catalogo.js`: Maneja la visualización del catálogo de libros.

- **src/assets/img/**: Carpeta para las imágenes de las portadas de los libros.

- **src/components/**: Componentes reutilizables de la aplicación.
  - `header.js`: Componente del encabezado.
  - `footer.js`: Componente del pie de página.
  - `libro-card.js`: Componente que muestra la información de un libro.

- **src/database/**: Archivos relacionados con la base de datos Neo4j.
  - `neo4j-config.js`: Configuración de la conexión a la base de datos.
  - `queries.js`: Consultas a la base de datos.
  - `models.js`: Modelos de datos para interactuar con la base de datos.

- **src/pages/**: Páginas de la aplicación.
  - `home.html`: Página de inicio.
  - `catalogo.html`: Página del catálogo de libros.
  - `detalle-libro.html`: Página de detalles de un libro.
  - `carrito.html`: Página del carrito de compras.
  - `checkout.html`: Página de pago.

- **src/models/**: Modelos de datos.
  - `libro.js`: Define la estructura del modelo de libro.

- **index.html**: Punto de entrada de la aplicación.

- **package.json**: Configuración de npm, incluyendo dependencias y scripts.

## Descripción de los Componentes

### Archivos Principales

- **`app.js`**: El punto de entrada principal de la aplicación. Configura el servidor Express, middleware, rutas y gestiona la conexión con Neo4j.

- **`.env`**: Archivo de variables de entorno que almacena información sensible (puertos, credenciales de Neo4j, etc.).

- **`package.json`**: Define las dependencias del proyecto y comandos npm.

### Carpetas y Archivos

#### `/Config`
Contiene archivos de configuración para diferentes partes del sistema.

- **`db.js`**: Centraliza la configuración del servidor y la base de datos Neo4j. Carga valores desde variables de entorno.

#### `/db`
Maneja la conexión a la base de datos Neo4j.

- **`neo4jConnection.js`**: Establece la conexión con la base de datos Neo4j, proporciona funciones para verificar conectividad, ejecutar consultas y cerrar la conexión.

#### `/public`
Contiene todos los archivos estáticos que se sirven al cliente.

- **`/css`**:
  - **`style.css`**: Define todos los estilos de la aplicación (diseño responsivo, colores, tarjetas de libros, formularios).

- **`/js`**:
  - **`index.js`**: Script para la página principal que muestra libros destacados y recomendados.
  - **`catalogo.js`**: Maneja la búsqueda, filtrado y visualización de libros en el catálogo.
  - **`carrito.js`**: Gestiona el carrito de compras (agregar, eliminar, actualizar cantidades) y muestra recomendaciones.
  - **`login.js`**: Maneja el registro e inicio de sesión de usuarios.

- **HTML**:
  - **`index.html`**: Página de inicio con sección destacada de libros.
  - **`catalogo.html`**: Página que muestra el catálogo de libros con buscador.
  - **`carrito.html`**: Muestra los libros en el carrito y recomendaciones personalizadas.
  - **`login.html`**: Formulario de registro y inicio de sesión.

#### `/routes`
Define las rutas API que el servidor expone.

- **`libroRoutes.js`**: Endpoints para buscar libros, obtener detalles y categorías.
- **`usuarioRoutes.js`**: Endpoints para gestión de usuarios, carrito y recomendaciones personalizadas.

#### `/services`
Contiene la lógica de negocio de la aplicación.

- **`googleBooksAPI.js`**: Servicios para interactuar con la API de Google Books.
- **`openLibraryAPI.js`**: Servicios para interactuar con la API de Open Library.
- **`libroService.js`**: Lógica para buscar y procesar información de libros desde múltiples fuentes.
- **`usuarioService.js`**: Lógica para gestionar usuarios, agregar libros al carrito y generar recomendaciones personalizadas utilizando Neo4j.

## Funcionalidades Principales

1. **Exploración de libros**: Búsqueda y visualización de libros desde las APIs de Google Books y Open Library.
2. **Carrito de compras**: Gestión de libros seleccionados para compra.
3. **Registro de usuarios**: Almacenamiento de información básica del usuario.
4. **Sistema de recomendaciones personalizado**: Recomendaciones basadas en las preferencias y acciones del usuario utilizando Neo4j.
5. **Recomendaciones en tiempo real**: Sugerencias de libros similares cuando un usuario agrega un libro al carrito.

## Sistema de Recomendaciones con Neo4j

El proyecto utiliza Neo4j para implementar un sistema de recomendación basado en grafos:

1. Cuando un usuario agrega un libro al carrito, se crea una relación `TIENE_EN_CARRITO` entre el usuario y el libro.
2. Los libros se asocian con categorías mediante relaciones `PERTENECE_A`.
3. Para generar recomendaciones, se buscan libros que pertenezcan a las mismas categorías que los libros del carrito del usuario.
4. Los libros populares se marcan como recomendados para mostrarlos en la página de inicio.

## Instalación

1. Clona el repositorio.
2. Navega a la carpeta del proyecto.
3. Ejecuta `npm install` para instalar las dependencias.

## Instalación y Configuración

### Prerrequisitos
- Node.js y npm
- Neo4j Database (instalado localmente o accesible remotamente)

### Pasos de Instalación

1. Clonar el repositorio:
```
git clone <url-del-repositorio>
```
2. Navegar al directorio del proyecto:
```
cd tienda-libros-online
```
3. Instalar dependencias:
```
npm install
```
4. Configurar las variables de entorno en un archivo `.env`.

## Uso

- Abre `index.html` en tu navegador para iniciar la aplicación.
- Explora el catálogo de libros, agrega libros al carrito y procede al pago.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.