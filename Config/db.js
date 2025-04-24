require('dotenv').config();

const config = {
    server: {
        port: process.env.PORT || 3000
    },
    neo4j: {
        uri: process.env.NEO4J_URI || 'bolt://localhost:7687',
        user: process.env.NEO4J_USER || 'neo4j',
        password: process.env.NEO4J_PASSWORD || 'password',
        database: process.env.NEO4J_DATABASE || 'neo4j'
    }
};

module.exports = config;