const express = require('express');
const router = express.Router();
const usuarioService = require('../services/usuarioService');

// Ruta para registrar/actualizar un usuario
router.post('/usuarios', async (req, res) => {
    try {
        const usuario = req.body;
        
        if (!usuario || !usuario.email || !usuario.nombre) {
            return res.status(400).json({ error: 'Datos de usuario incompletos' });
        }
        
        const resultado = await usuarioService.crearUsuario(usuario);
        
        if (resultado) {
            res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
        } else {
            res.status(500).json({ error: 'Error al registrar usuario' });
        }
    } catch (error) {
        console.error('Error en POST /usuarios:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});

// Ruta para agregar un libro al carrito
router.post('/usuarios/:email/carrito', async (req, res) => {
    try {
        const { email } = req.params;
        const libro = req.body;
        
        if (!libro || !libro.id || !libro.titulo) {
            return res.status(400).json({ error: 'Datos del libro incompletos' });
        }
        
        const resultado = await usuarioService.agregarLibroAlCarrito(email, libro);
        
        if (resultado) {
            res.status(201).json({ mensaje: 'Libro agregado al carrito correctamente' });
        } else {
            res.status(500).json({ error: 'Error al agregar libro al carrito' });
        }
    } catch (error) {
        console.error(`Error en POST /usuarios/${req.params.email}/carrito:`, error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});

// Ruta para obtener recomendaciones
router.get('/usuarios/:email/recomendaciones', async (req, res) => {
    try {
        const { email } = req.params;
        
        const recomendaciones = await usuarioService.obtenerRecomendaciones(email);
        
        res.json({ libros: recomendaciones });
    } catch (error) {
        console.error(`Error en GET /usuarios/${req.params.email}/recomendaciones:`, error);
        res.status(500).json({ error: 'Error al obtener recomendaciones' });
    }
});

// Ruta para obtener libros recomendados para la página de inicio
router.get('/libros-recomendados', async (req, res) => {
    try {
        const { limit = 4 } = req.query;
        
        const recomendados = await usuarioService.obtenerLibrosRecomendados(limit);
        
        res.json({ libros: recomendados });
    } catch (error) {
        console.error(`Error en GET /libros-recomendados:`, error);
        res.status(500).json({ error: 'Error al obtener libros recomendados' });
    }
});

module.exports = router;