-- =====================================================
-- SEED: tabla cuidadores (Railway MySQL)
-- Pegar en HeidiSQL > Consulta > Ejecutar
-- =====================================================

-- Limpiar asignaciones primero (FK)
DELETE FROM mascotas_cuidadores;

-- Limpiar cuidadores y reiniciar IDs
DELETE FROM cuidadores;
ALTER TABLE cuidadores AUTO_INCREMENT = 1;

-- Insertar los 5 cuidadores del proyecto
INSERT INTO cuidadores (nombre, rol, ciudad, calificacion, experiencia_anios, servicios_completados, descripcion, telefono, whatsapp, foto_url) VALUES
  ('Wilinton Castaño Cifuentes',        'Paseador Senior',     'Bucaramanga',  4.8, 5, 120, 'Cuidador enfocado en paseos estructurados, acompanamiento diario y rutinas de ejercicio para mascotas con alta energia.',                                                              '3201112233', '3201112233', 'https://avatars.githubusercontent.com/u/73048424?s=64&v=4'),
  ('Nelson Hernando Mogollón Rodríguez','Cuidador Clínico',    'Bogotá',       4.9, 7, 134, 'Especialista en acompanamiento post consulta, seguimiento de medicamentos y apoyo cercano para familias con mascotas en recuperacion.',                                                 '3104448899', '3104448899', NULL),
  ('Adrián Farid Ruiz Montaña',         'Entrenador',          'Floridablanca',4.7, 4,  86, 'Entrenador dedicado a mejorar la convivencia, la obediencia basica y la confianza de cada mascota a traves de rutinas positivas.',                                                      '3152229088', '3152229088', NULL),
  ('Diana Viviana Valderrama Castro',   'Cuidadora Nocturna',  'Medellín',     4.8, 5, 112, 'Especialista en acompanamiento tranquilo durante la noche, administracion de rutinas y seguimiento cercano para mascotas sensibles.',                                                     '3176547701', '3176547701', NULL),
  ('Cristofer Ramón Jaimez López',      'Paseador y Cuidador', 'Bucaramanga',  5.0, 6, 148, 'Cuidador integral con enfoque en caminatas, acompanamiento diario y comunicacion constante con cada familia sobre el estado de su mascota.',                                             '3018842200', '3018842200', NULL);

-- Verificar resultado
SELECT id, nombre, rol, ciudad FROM cuidadores;
