document.addEventListener('DOMContentLoaded', () => {
    // Verificar si ya hay un usuario en localStorage
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario) {
        // Modificar formulario para mostrar que ya está logueado
        document.getElementById('login-form').innerHTML = `
            <div class="usuario-info">
                <h3>¡Bienvenido, ${usuario.nombre}!</h3>
                <p>Estás logueado con el correo ${usuario.email}</p>
                <button id="btn-logout" class="btn">Cerrar sesión</button>
            </div>
        `;
        
        // Manejar evento de cerrar sesión
        document.getElementById('btn-logout').addEventListener('click', () => {
            localStorage.removeItem('usuario');
            localStorage.removeItem('carrito');
            alert('Sesión cerrada correctamente');
            window.location.reload();
        });
    } else {
        // Manejar evento de envío del formulario
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const direccion = document.getElementById('direccion').value.trim();
            
            if (!nombre || !email || !direccion) {
                alert('Por favor completa todos los campos');
                return;
            }
            
            try {
                // Conectamos con el backend para guardar el usuario en Neo4j
                const response = await fetch('http://localhost:3000/api/usuarios', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nombre, email, direccion })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Guardamos también en localStorage
                    const usuario = { nombre, email, direccion };
                    localStorage.setItem('usuario', JSON.stringify(usuario));
                    
                    alert('¡Inicio de sesión / registro exitoso!');
                    window.location.href = 'index.html';
                } else {
                    alert(`Error: ${data.error}`);
                }
            } catch (error) {
                console.error('Error al iniciar sesión:', error);
                alert('Error al iniciar sesión. Intente nuevamente más tarde.');
                
                // Como plan B, guardar en localStorage aunque falle Neo4j
                const usuario = { nombre, email, direccion };
                localStorage.setItem('usuario', JSON.stringify(usuario));
                
                alert('Sesión iniciada localmente (sin conexión a base de datos)');
                window.location.href = 'index.html';
            }
        });
    }
});

// Nueva función para guardar el libro en Neo4j cuando se agrega al carrito
async function guardarLibroEnNeo4j(email, libro) {
    try {
        const response = await fetch(`http://localhost:3000/api/usuarios/${encodeURIComponent(email)}/carrito`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(libro)
        });
        
        if (!response.ok) {
            const data = await response.json();
            console.error('Error al guardar libro en Neo4j:', data.error);
        }
    } catch (error) {
        console.error('Error al guardar libro en Neo4j:', error);
        // No mostramos alerta al usuario porque este error no afecta la funcionalidad principal
    }
}