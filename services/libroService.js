const googleBooksAPI = require('./googleBooksAPI');
const openLibraryAPI = require('./openLibraryAPI');
const { runQuery } = require('../db/neo4jConnection');

/**
 * Busca libros con campos simplificados (solo portada, título, descripción y autor)
 */
async function buscarLibros(query, page = 1, limit = 10) {
    try {
        let resultado;
        
        if (query) {
            // Si hay consulta, buscamos en las APIs
            const googleResults = await googleBooksAPI.searchBooks(query, (page - 1) * limit, limit);
            
            // Procesamos resultados de Google Books con campos simplificados
            resultado = {
                libros: googleResults?.items?.map(item => ({
                    id: item.id,
                    fuente: 'google',
                    titulo: item.volumeInfo?.title || 'Título desconocido',
                    autor: item.volumeInfo?.authors ? item.volumeInfo?.authors.join(', ') : 'Autor desconocido',
                    descripcion: item.volumeInfo?.description || 'No hay descripción disponible',
                    portada: item.volumeInfo?.imageLinks?.thumbnail || null
                })) || [],
                total: googleResults?.totalItems || 0
            };
        } 
        else {
            // Si no hay consulta, mostramos libros populares
            const temas = ['fiction', 'science', 'history', 'bestseller'];
            const tema = temas[Math.floor(Math.random() * temas.length)];
            const googleResults = await googleBooksAPI.searchBooks(tema, (page - 1) * limit, limit);
            
            resultado = {
                libros: googleResults?.items?.map(item => ({
                    id: item.id,
                    fuente: 'google',
                    titulo: item.volumeInfo?.title || 'Título desconocido',
                    autor: item.volumeInfo?.authors ? item.volumeInfo?.authors.join(', ') : 'Autor desconocido',
                    descripcion: item.volumeInfo?.description || 'No hay descripción disponible',
                    portada: item.volumeInfo?.imageLinks?.thumbnail || null
                })) || [],
                total: googleResults?.totalItems || 0
            };
        }
        
        return resultado;
    } catch (error) {
        console.error('Error en buscarLibros:', error);
        return { libros: [], total: 0 };
    }
}

/**
 * Obtiene un libro con datos simplificados
 */
async function obtenerLibro(id, fuente) {
    try {
        let libro = null;
        
        if (fuente === 'google') {
            const googleLibro = await googleBooksAPI.getBookById(id);
            libro = {
                id: googleLibro.id,
                fuente: 'google',
                titulo: googleLibro.volumeInfo?.title || 'Título desconocido',
                autor: googleLibro.volumeInfo?.authors ? googleLibro.volumeInfo.authors.join(', ') : 'Autor desconocido',
                descripcion: googleLibro.volumeInfo?.description || 'No hay descripción disponible',
                portada: googleLibro.volumeInfo?.imageLinks?.thumbnail || null
            };
        }
        
        return libro;
    } catch (error) {
        console.error(`Error al obtener libro ${id} de ${fuente}:`, error);
        throw error;
    }
}

module.exports = {
    buscarLibros,
    obtenerLibro
};