// Función para cargar y mostrar los items del carrito
function cargarCarrito() {
    const carritoItems = document.getElementById('carrito-items');
    const carritoTotal = document.getElementById('carrito-total');
    const carritoVacio = document.getElementById('carrito-vacio');
    const recomendacionesSection = document.getElementById('recomendaciones');
    
    // Obtener carrito del localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Verificar si el carrito está vacío
    if (carrito.length === 0) {
        carritoItems.innerHTML = '';
        carritoVacio.style.display = 'block';
        carritoTotal.innerHTML = '';
        recomendacionesSection.style.display = 'none';
        return;
    }
    
    // Ocultar mensaje de carrito vacío
    carritoVacio.style.display = 'none';
    
    // Mostrar items del carrito
    let html = '';
    let total = 0;
    
    carrito.forEach((libro, index) => {
        const subtotal = libro.precio * libro.cantidad;
        total += subtotal;
        
        html += `
            <div class="carrito-item">
                <img src="${libro.portada || '/img/portada-no-disponible.jpg'}" alt="${libro.titulo}">
                <div class="carrito-item-info">
                    <h3>${libro.titulo}</h3>
                    <p>${libro.autor}</p>
                    <div class="cantidad">
                        <button onclick="actualizarCantidad(${index}, -1)">-</button>
                        <span>${libro.cantidad}</span>
                        <button onclick="actualizarCantidad(${index}, 1)">+</button>
                    </div>
                </div>
                <div class="carrito-item-precio">
                    <p>$${libro.precio} x ${libro.cantidad}</p>
                    <p><strong>$${subtotal.toFixed(2)}</strong></p>
                    <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">Eliminar</button>
                </div>
            </div>
        `;
    });
    
    carritoItems.innerHTML = html;
    carritoTotal.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
    
    // Mostrar sección de recomendaciones
    recomendacionesSection.style.display = 'block';
    
    // Cargar recomendaciones basadas en los libros del carrito
    cargarRecomendaciones();
}

// Función para actualizar la cantidad de un libro en el carrito
function actualizarCantidad(index, cambio) {
    // Obtener carrito del localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (carrito[index]) {
        carrito[index].cantidad += cambio;
        
        // No permitir cantidades menores a 1
        if (carrito[index].cantidad < 1) {
            carrito[index].cantidad = 1;
        }
        
        // Guardar carrito actualizado
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // Actualizar la visualización del carrito
        cargarCarrito();
    }
}

// Función para eliminar un libro del carrito
function eliminarDelCarrito(index) {
    // Obtener carrito del localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (confirm('¿Estás seguro de que quieres eliminar este libro del carrito?')) {
        carrito.splice(index, 1);
        
        // Guardar carrito actualizado
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // Actualizar la visualización del carrito
        cargarCarrito();
    }
}

// Función para finalizar la compra y guardar en Neo4j
async function finalizarCompra() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (!usuario) {
        alert('Debes iniciar sesión para finalizar la compra');
        window.location.href = 'login.html';
        return;
    }
    
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    try {
        // Primero nos aseguramos que el usuario exista en Neo4j
        await fetch('http://localhost:3000/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario)
        });
        
        // Luego agregamos cada libro del carrito a Neo4j
        for (const libro of carrito) {
            await fetch(`/api/usuarios/${encodeURIComponent(usuario.email)}/carrito`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(libro)
            });
        }
        
        alert('¡Compra finalizada con éxito! Gracias por tu compra.');
        localStorage.setItem('carrito', JSON.stringify([]));
        cargarCarrito();
    } catch (error) {
        console.error('Error al finalizar la compra:', error);
        alert('Error al procesar la compra. Intente nuevamente más tarde.');
    }
}

// Actualizar la función cargarRecomendaciones para usar Neo4j
async function cargarRecomendaciones() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuario) return;
    
    try {
        const librosRecomendados = document.getElementById('libros-recomendados');
        if (!librosRecomendados) return;
        
        librosRecomendados.innerHTML = '<p>Cargando recomendaciones...</p>';
        
        // Intentar obtener recomendaciones desde Neo4j
        const response = await fetch(`http://localhost:3000/api/usuarios/${encodeURIComponent(usuario.email)}/recomendaciones`);
        const data = await response.json();
        
        if (data.libros && data.libros.length > 0) {
            let html = '';
            
            data.libros.forEach(libro => {
                html += `
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
            
            librosRecomendados.innerHTML = html;
        } else {
            // Si no hay recomendaciones, mostramos libros aleatorios
            const temas = ['fiction', 'science', 'fantasy', 'history'];
            const temaAleatorio = temas[Math.floor(Math.random() * temas.length)];
            
            const apiResponse = await fetch(`http://localhost:3000/api/libros?q=${temaAleatorio}&limit=4`);
            const apiData = await apiResponse.json();
            
            if (apiData.libros && apiData.libros.length > 0) {
                let html = '';
                
                apiData.libros.forEach(libro => {
                    html += `
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
                
                librosRecomendados.innerHTML = html;
            } else {
                librosRecomendados.innerHTML = '<p>No hay recomendaciones disponibles</p>';
            }
        }
    } catch (error) {
        console.error('Error al cargar recomendaciones:', error);
        const librosRecomendados = document.getElementById('libros-recomendados');
        if (librosRecomendados) {
            librosRecomendados.innerHTML = '<p>Error al cargar recomendaciones</p>';
        }
    }
}

// Función para guardar el libro en Neo4j cuando se agrega al carrito
function guardarLibroEnNeo4j(email, libro) {
    fetch(`http://localhost:3000/api/usuarios/${encodeURIComponent(email)}/carrito`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(libro)
    }).catch(error => {
        console.error('Error al guardar libro en Neo4j:', error);
    });
}

// Actualizar la función agregarAlCarrito para guardar en Neo4j
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
            cargarCarrito(); // Actualizar la visualización del carrito
        })
        .catch(error => {
            console.error('Error al agregar libro al carrito:', error);
            alert('Error al agregar el libro al carrito');
        });
}

// Manejar evento de finalizar compra
document.addEventListener('DOMContentLoaded', () => {
    cargarCarrito();
    
    document.getElementById('btn-finalizar').addEventListener('click', finalizarCompra);
});