const bcrypt = require('bcryptjs');

async function main() {
  const hashAdmin = await bcrypt.hash('admin123', 10);
  const hashTest  = await bcrypt.hash('test123',  10);

  console.log('');
  console.log('-- ======================================================');
  console.log('-- PEGAR ESTE SCRIPT EN HEIDISQL (Consulta > Ejecutar)');
  console.log('-- ======================================================');
  console.log('');
  console.log('-- 1. Agregar columna rol si no existe');
  console.log("ALTER TABLE usuarios");
  console.log("  ADD COLUMN IF NOT EXISTS rol ENUM('admin','usuario') NOT NULL DEFAULT 'usuario'");
  console.log("  AFTER es_invitado;");
  console.log('');
  console.log('-- 2. Limpiar y reiniciar usuarios');
  console.log('DELETE FROM usuarios;');
  console.log('ALTER TABLE usuarios AUTO_INCREMENT = 1;');
  console.log('');
  console.log('-- 3. Insertar usuarios con hash bcrypt');
  console.log("INSERT INTO usuarios (nombre, email, password_hash, es_invitado, rol) VALUES");
  console.log("  ('Demo Admin',   'demo@petcare.com', '" + hashAdmin + "', 0, 'admin'),");
  console.log("  ('Usuario Test', 'test@petcare.com', '" + hashTest  + "', 0, 'usuario');");
  console.log('');
  console.log('-- Credenciales resultantes:');
  console.log('--   ADMIN : demo@petcare.com  /  admin123');
  console.log('--   NORMAL: test@petcare.com  /  test123');
}

main().catch(console.error);
