// Función para cargar libros destacados en la página principal
async function cargarLibrosDestacados() {
    try {
        // Primero intentamos obtener libros recomendados de Neo4j
        const response = await fetch('http://localhost:3000/api/libros-recomendados?limit=4');
        const data = await response.json();
        
        const contenedor = document.getElementById('libros-destacados');
        
        // Si hay libros recomendados en Neo4j, los mostramos
        if (data.libros && data.libros.length > 0) {
            mostrarLibros(data.libros, contenedor);
        } else {
            // Si no hay recomendaciones, mostramos libros generales
            const responseGeneral = await fetch('http://localhost:3000/api/libros?limit=4');
            const dataGeneral = await responseGeneral.json();
            
            if (dataGeneral.libros && dataGeneral.libros.length > 0) {
                mostrarLibros(dataGeneral.libros, contenedor);
            } else {
                contenedor.innerHTML = '<p>No se encontraron libros destacados</p>';
            }
        }
    } catch (error) {
        console.error('Error al cargar libros destacados:', error);
        document.getElementById('libros-destacados').innerHTML = 
            '<p>Error al cargar los libros destacados. Intente nuevamente más tarde.</p>';
    }
}

// Función auxiliar para mostrar los libros en el contenedor
function mostrarLibros(libros, contenedor) {
    contenedor.innerHTML = '';
    
    libros.forEach(libro => {
        contenedor.innerHTML += `
            <div class="libro-card">
                <div class="libro-portada">
                    <img src="${libro.portada || '/img/portada-no-disponible.jpg'}" alt="${libro.titulo}">
                </div>
                <div class="libro-info">
                    <h3>${libro.titulo}</h3>
                    <p>${libro.autor}</p>
                    <p class="libro-precio">$${(Math.random() * 30 + 10).toFixed(2)}</p>
                    <button class="btn" onclick="agregarAlCarrito('${libro.id}', '${libro.fuente}')">
                        Añadir al carrito
                    </button>
                </div>
            </div>
        `;
    });
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

// Cargar libros destacados cuando se cargue la página
document.addEventListener('DOMContentLoaded', cargarLibrosDestacados);