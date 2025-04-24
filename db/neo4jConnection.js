const neo4j = require('neo4j-driver');
require('dotenv').config();

// Configuración de conexión con valores correctos
const URI = process.env.NEO4J_URI || 'bolt://localhost:7687';
const USER = process.env.NEO4J_USER || 'neo4j';
const PASSWORD = process.env.NEO4J_PASSWORD || '55969903'; // Usa tu contraseña directamente
const DATABASE = process.env.NEO4J_DATABASE || 'neo4j';

// Añade logs para ver si los valores se cargan correctamente
console.log('Intentando conectar a Neo4j con:');
console.log(`- URI: ${URI}`);
console.log(`- Usuario: ${USER}`);
console.log(`- Base de datos: ${DATABASE}`);

try {
    const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD), {
        maxConnectionPoolSize: 50,
        connectionAcquisitionTimeout: 5000,
        disableLosslessIntegers: true
    });

    // Funciones para interactuar con Neo4j
    async function verifyConnectivity() {
        try {
            await driver.verifyConnectivity();
            console.log('✅ Conexión a Neo4j establecida correctamente');
            return true;
        } catch (error) {
            console.error('❌ Error al conectar con Neo4j:', error);
            throw error;
        }
    }

    async function runQuery(cypher, params = {}) {
        const session = driver.session({ database: DATABASE });
        try {
            console.log(`Ejecutando consulta: ${cypher}`);
            console.log(`Con parámetros:`, params);
            const result = await session.run(cypher, params);
            return result.records;
        } catch (error) {
            console.error('Error al ejecutar consulta en Neo4j:', error);
            throw error;
        } finally {
            await session.close();
        }
    }

    async function closeConnection() {
        try {
            await driver.close();
            console.log('🔒 Conexión a Neo4j cerrada correctamente');
        } catch (error) {
            console.error('Error al cerrar la conexión con Neo4j:', error);
            throw error;
        }
    }

    module.exports = {
        driver,
        runQuery,
        verifyConnectivity,
        closeConnection
    };
} catch (error) {
    console.error('Error al crear el driver de Neo4j:', error);
    
    // Exporta funciones simuladas para evitar que la aplicación falle completamente
    module.exports = {
        driver: null,
        runQuery: async () => {
            console.error('Neo4j no está disponible');
            return [];
        },
        verifyConnectivity: async () => {
            console.error('Neo4j no está disponible');
            return false;
        },
        closeConnection: async () => {
            console.error('Neo4j no está disponible');
        }
    };
}