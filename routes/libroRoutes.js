const express = require('express');
const router = express.Router();
const libroService = require('../services/libroService');

// Ruta para buscar libros (simplificada)
router.get('/libros', async (req, res) => {
    try {
        const { q, page = 1, limit = 10 } = req.query;
        
        const resultado = await libroService.buscarLibros(q, parseInt(page), parseInt(limit));
        
        res.json(resultado);
    } catch (error) {
        console.error('Error en ruta /libros:', error);
        res.status(500).json({ error: 'Error al buscar libros' });
    }
});

// Ruta para obtener un libro específico (simplificado)
router.get('/libros/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { fuente = 'google' } = req.query;
        
        const libro = await libroService.obtenerLibro(id, fuente);
        
        if (!libro) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }
        
        res.json(libro);
    } catch (error) {
        console.error(`Error en ruta /libros/${req.params.id}:`, error);
        res.status(500).json({ error: 'Error al obtener el libro' });
    }
});

// Ruta para guardar un libro en Neo4j
router.post('/libros', async (req, res) => {
    try {
        const libro = req.body;
        
        if (!libro || !libro.id || !libro.titulo) {
            return res.status(400).json({ error: 'Datos del libro incompletos' });
        }
        
        const resultado = await libroService.guardarLibroEnNeo4j(libro);
        
        if (resultado) {
            res.status(201).json({ mensaje: 'Libro guardado correctamente' });
        } else {
            res.status(500).json({ error: 'Error al guardar el libro' });
        }
    } catch (error) {
        console.error('Error en POST /libros:', error);
        res.status(500).json({ error: 'Error al guardar el libro' });
    }
});

// Ruta para obtener categorías
router.get('/categorias', async (req, res) => {
    try {
        const categorias = await libroService.obtenerCategorias();
        res.json(categorias);
    } catch (error) {
        console.error('Error en ruta /categorias:', error);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
});

module.exports = router;