// Simple database initialization script
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Create database pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function executeSimpleSchema() {
  console.log('🚀 Inicializando base de datos con esquema simple...\n');
  
  try {
    // Test connection
    const client = await pool.connect();
    console.log('✅ Conectado a PostgreSQL exitosamente');
    
    // Read simple schema
    const schemaPath = path.join(process.cwd(), 'database', 'simple-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('🔧 Ejecutando esquema simplificado...');
    
    // Execute the entire schema as one query
    await client.query(schema);
    
    console.log('✅ ¡Esquema ejecutado correctamente!');
    
    // Verify users were created
    const result = await client.query('SELECT username, role FROM users ORDER BY role DESC');
    
    console.log('\n👥 Usuarios creados:');
    result.rows.forEach(user => {
      console.log(`   • ${user.username} (${user.role})`);
    });
    
    console.log('\n🎉 ¡Base de datos configurada exitosamente!');
    console.log('\n📋 Credenciales para iniciar sesión:');
    console.log('👤 Administrador:');
    console.log('   Usuario: admin');
    console.log('   Contraseña: admin123');
    console.log('\n👤 Usuario normal:');
    console.log('   Usuario: usuario1');
    console.log('   Contraseña: user123');
    console.log('\n🌐 Accede a: http://localhost:3000/login');
    
    client.release();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Verifica que:');
    console.log('1. PostgreSQL esté ejecutándose');
    console.log('2. La base de datos "fastfoodcontrol" existe');
    console.log('3. Las credenciales en .env.local sean correctas');
  }
  
  await pool.end();
}

executeSimpleSchema();