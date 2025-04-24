// Variables para la paginación
let paginaActual = 1;
const librosPorPagina = 8;
let ultimaBusqueda = '';

// Función para buscar libros
async function buscarLibros(query, pagina = 1) {
    try {
        const contenedor = document.getElementById('resultados-busqueda');
        contenedor.innerHTML = '<p>Cargando libros...</p>';
        
        // URL completa para evitar problemas con el puerto
        const url = query 
            ? `http://localhost:3000/api/libros?q=${encodeURIComponent(query)}&page=${pagina}&limit=${librosPorPagina}`
            : `http://localhost:3000/api/libros?page=${pagina}&limit=${librosPorPagina}`;
            
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.libros && data.libros.length > 0) {
            contenedor.innerHTML = '';
            
            data.libros.forEach(libro => {
                contenedor.innerHTML += `
                    <div class="libro-card">
                        <div class="libro-portada">
                            <img src="${libro.portada || '/img/portada-no-disponible.jpg'}" alt="${libro.titulo}">
                        </div>
                        <div class="libro-info">
                            <h3>${libro.titulo}</h3>
                            <p>${libro.autor}</p>
                            <p class="libro-descripcion">${libro.descripcion ? libro.descripcion.substring(0, 100) + '...' : 'Sin descripción disponible'}</p>
                            <p class="libro-precio">$${(Math.random() * 30 + 10).toFixed(2)}</p>
                            <button class="btn" onclick="agregarAlCarrito('${libro.id}', '${libro.fuente}')">
                                Añadir al carrito
                            </button>
                        </div>
                    </div>
                `;
            });
            
            // Agregar controles de paginación
            const totalPaginas = Math.ceil(data.total / librosPorPagina);
            if (totalPaginas > 1) {
                let paginacion = '<div class="paginacion">';
                
                if (pagina > 1) {
                    paginacion += `<button class="btn" onclick="cambiarPagina(${pagina - 1})">Anterior</button>`;
                }
                
                paginacion += `<span>Página ${pagina} de ${totalPaginas}</span>`;
                
                if (pagina < totalPaginas) {
                    paginacion += `<button class="btn" onclick="cambiarPagina(${pagina + 1})">Siguiente</button>`;
                }
                
                paginacion += '</div>';
                contenedor.innerHTML += paginacion;
            }
        } else {
            contenedor.innerHTML = '<p>No se encontraron libros para esta búsqueda</p>';
        }
    } catch (error) {
        console.error('Error al buscar libros:', error);
        document.getElementById('resultados-busqueda').innerHTML = 
            '<p>Error al cargar los libros. Intente nuevamente más tarde.</p>';
    }
}

// Función para cambiar de página
function cambiarPagina(pagina) {
    paginaActual = pagina;
    buscarLibros(ultimaBusqueda, paginaActual);
    // Hacer scroll hacia arriba para mostrar los nuevos resultados
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Función para agregar un libro al carrito 
function agregarAlCarrito(id, fuente) {
    // Verificar si el usuario está logueado
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuario) {
        alert('Debes iniciar sesión para agregar libros al carrito');
        window.location.href = 'login.html';
        return;
    }
    
    // Obtener el carrito actual del localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Verificar si el libro ya está en el carrito
    const libroEnCarrito = carrito.find(item => item.id === id);
    
    if (libroEnCarrito) {
        alert('Este libro ya está en tu carrito');
        return;
    }
    
    // Obtener detalles del libro y agregarlo al carrito
    fetch(`http://localhost:3000/api/libros/${id}?fuente=${fuente}`)
        .then(response => response.json())
        .then(libro => {
            // Agregar libro al carrito con cantidad 1
            carrito.push({
                ...libro,
                cantidad: 1,
                precio: (Math.random() * 30 + 10).toFixed(2) // Precio aleatorio entre 10 y 40
            });
            
            // Guardar carrito actualizado
            localStorage.setItem('carrito', JSON.stringify(carrito));
            
            // También guardamos en Neo4j para recomendaciones futuras
            guardarLibroEnNeo4j(usuario.email, libro);
            
            alert('Libro agregado al carrito');
        })
        .catch(error => {
            console.error('Error al agregar libro al carrito:', error);
            alert('Error al agregar el libro al carrito');
        });
}

// Nueva función para guardar el libro en Neo4j cuando se agrega al carrito
function guardarLibroEnNeo4j(email, libro) {
    fetch(`http://localhost:3000/api/usuarios/${encodeURIComponent(email)}/carrito`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(libro)
    }).catch(error => {
        console.error('Error al guardar libro en Neo4j:', error);
        // No mostramos alerta al usuario porque este error no afecta la funcionalidad principal
    });
}

// Cargar libros iniciales cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    // Cargar libros populares al inicio
    buscarLibros('', paginaActual);
    
    // Configurar el botón de búsqueda
    document.getElementById('btn-buscar').addEventListener('click', () => {
        const query = document.getElementById('busqueda').value.trim();
        ultimaBusqueda = query;
        paginaActual = 1;
        buscarLibros(query, paginaActual);
    });
    
    // Permitir búsqueda al presionar Enter en el campo de búsqueda
    document.getElementById('busqueda').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = document.getElementById('busqueda').value.trim();
            ultimaBusqueda = query;
            paginaActual = 1;
            buscarLibros(query, paginaActual);
        }
    });
});