const axios = require('axios');

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';

/**
 * Busca libros en la API de Google Books
 * @param {string} query - Término de búsqueda
 * @param {number} startIndex - Índice de inicio para paginación
 * @param {number} maxResults - Cantidad máxima de resultados
 */
async function searchBooks(query, startIndex = 0, maxResults = 10) {
    try {
        const response = await axios.get(GOOGLE_BOOKS_API_URL, {
            params: {
                q: query,
                startIndex,
                maxResults,
                langRestrict: 'es'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al buscar en Google Books API:', error);
        throw error;
    }
}

/**
 * Obtiene detalles de un libro específico
 * @param {string} bookId - ID del libro en Google Books
 */
async function getBookById(bookId) {
    try {
        const response = await axios.get(`${GOOGLE_BOOKS_API_URL}/${bookId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener libro de Google Books API:', error);
        throw error;
    }
}

module.exports = {
    searchBooks,
    getBookById
};