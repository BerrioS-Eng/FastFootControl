// Database initialization script
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Create database pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test connection
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Conectado a PostgreSQL exitosamente');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error.message);
    return false;
  }
}

// Execute query
async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    console.error('Error ejecutando consulta:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

async function initializeDatabase() {
  console.log('🚀 Iniciando configuración de la base de datos...\n');
  
  try {
    // Test connection
    console.log('📡 Probando conexión a PostgreSQL...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ No se pudo conectar a la base de datos');
      console.log('\n📋 Instrucciones para configurar PostgreSQL:');
      console.log('1. Verifica que PostgreSQL esté ejecutándose');
      console.log('2. Verifica que la base de datos "fastfoodcontrol" existe');
      console.log('3. Actualiza las credenciales en el archivo .env.local');
      console.log('4. Ejecuta este script nuevamente');
      return;
    }
    
    // Read and execute schema
    console.log('📄 Leyendo esquema SQL...');
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('🔧 Ejecutando esquema SQL...');
    
    // Split schema into individual statements and execute them
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await query(statement);
        } catch (error) {
          // Ignore "already exists" errors
          if (!error.message.includes('already exists') && 
              !error.message.includes('duplicate key value')) {
            console.warn('⚠️  Advertencia ejecutando:', statement.substring(0, 50) + '...');
            console.warn('   Error:', error.message);
          }
        }
      }
    }
    
    console.log('✅ ¡Base de datos inicializada correctamente!');
    console.log('\n🎉 ¡Configuración completada!');
    console.log('\n📋 Credenciales de prueba:');
    console.log('👤 Administrador:');
    console.log('   Usuario: admin');
    console.log('   Contraseña: admin123');
    console.log('\n👤 Usuario normal:');
    console.log('   Usuario: usuario1');
    console.log('   Contraseña: user123');
    console.log('\n🌐 Accede a la aplicación en: http://localhost:3000/login');
    
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error.message);
    console.log('\n💡 Posibles soluciones:');
    console.log('1. Verifica que PostgreSQL esté ejecutándose');
    console.log('2. Verifica las credenciales en .env.local');
    console.log('3. Asegúrate de que la base de datos "fastfoodcontrol" existe');
  }
  
  // Close pool
  await pool.end();
}

// Run the initialization
initializeDatabase();