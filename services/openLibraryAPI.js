const axios = require('axios');

const OPEN_LIBRARY_API_URL = 'https://openlibrary.org/api';
const OPEN_LIBRARY_SEARCH_URL = 'https://openlibrary.org/search.json';

/**
 * Buscar libros en Open Library API
 * @param {string} query - Texto de búsqueda
 * @param {number} limit - Número máximo de resultados
 */
async function buscarLibros(query, limit = 10) {
    try {
        const response = await axios.get(OPEN_LIBRARY_SEARCH_URL, {
            params: {
                q: query,
                limit
            }
        });
        
        return response.data.docs.slice(0, limit).map(item => ({
            titulo: item.title,
            autor: item.author_name ? item.author_name.join(', ') : 'Desconocido',
            anio: item.first_publish_year || null,
            isbn: item.isbn ? item.isbn[0] : null,
            editorial: item.publisher ? item.publisher[0] : 'Desconocida',
            openLibraryId: item.key,
            idioma: item.language ? item.language[0] : null,
            portada: item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` : null
        }));
    } catch (error) {
        console.error('Error al buscar en Open Library API:', error);
        throw error;
    }
}

/**
 * Obtener detalles de un libro por su ID en Open Library
 * @param {string} bookId - ID del libro en Open Library (formato: /works/OL...)
 */
async function obtenerLibroPorId(bookId) {
    if (!bookId.startsWith('/works/')) {
        bookId = `/works/${bookId}`;
    }
    
    try {
        const response = await axios.get(`https://openlibrary.org${bookId}.json`);
        const item = response.data;
        
        // Obtener detalles adicionales como la portada
        const portadaUrl = item.covers && item.covers.length > 0 
            ? `https://covers.openlibrary.org/b/id/${item.covers[0]}-L.jpg` 
            : null;
            
        return {
            titulo: item.title,
            descripcion: item.description?.value || item.description || '',
            openLibraryId: item.key,
            portada: portadaUrl,
            temas: item.subjects || [],
            fechaCreacion: item.created?.value || null
        };
    } catch (error) {
        console.error('Error al obtener detalles del libro en Open Library API:', error);
        throw error;
    }
}

module.exports = {
    buscarLibros,
    obtenerLibroPorId
};