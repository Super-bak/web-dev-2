const { Client } = require('pg');

const client = new Client({
    user: "leo",
    host: "localhost",
    database: 'lab6_db',
    password: "alk123",
    port: 5432, 
    
});

client.connect((err) => {
    if (err) {
        console.error('Error connecting to PostgreSQL', err.stack);
    } else {
        console.log('Connected to PostgreSQL');
    }
});

module.exports = client;