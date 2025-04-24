require('dotenv').config();
const express = require('express');
const { verifyConnectivity, closeConnection } = require('./db/neo4jConnection');
const config = require('./Config/db');
const path = require('path');
const cors = require('cors');
const libroRoutes = require('./routes/libroRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const PORT = config.server.port || 3000;

const app = express();

// Middleware para registrar todas las solicitudes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));

// Rutas API
app.use('/api', libroRoutes);
app.use('/api', usuarioRoutes);

// Ruta de estado
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, async () => {
    console.log(`El servidor corre en http://localhost:${PORT}`);
    try {
        await verifyConnectivity();
    } catch (error) {
        console.error('Error al verificar la conectividad con Neo4j:', error);
        // No cerramos la aplicación, intentamos seguir funcionando sin Neo4j
    }
});

// Manejar cierre de la aplicación
process.on('SIGINT', async () => {
    console.log('Cerrando servidor...');
    try {
        await closeConnection();
        process.exit(0);
    } catch (error) {
        console.error('Error al cerrar la conexión con Neo4j:', error);
        process.exit(1);
    }
});