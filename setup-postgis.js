const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

async function setup() {
  try {
    await client.connect();
    console.log('✅ Conectado a Render PostgreSQL');
    await client.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    console.log('✅ Extensión PostGIS habilitada exitosamente');
  } catch (err) {
    console.error('❌ Error configurando PostGIS:', err.message);
  } finally {
    await client.end();
  }
}

setup();
