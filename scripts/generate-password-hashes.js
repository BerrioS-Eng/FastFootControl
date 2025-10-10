// Script to generate password hashes for default users
const bcrypt = require('bcryptjs');

async function generateHashes() {
  console.log('Generando hashes de contraseñas...\n');
  
  // Hash for admin123
  const adminHash = await bcrypt.hash('admin123', 10);
  console.log('Usuario: admin');
  console.log('Contraseña: admin123');
  console.log('Hash:', adminHash);
  console.log();
  
  // Hash for user123
  const userHash = await bcrypt.hash('user123', 10);
  console.log('Usuario: usuario1');
  console.log('Contraseña: user123');
  console.log('Hash:', userHash);
  console.log();
  
  console.log('¡Hashes generados exitosamente!');
  console.log('Puedes usar estos hashes para actualizar el archivo schema.sql');
}

generateHashes().catch(console.error);