-- ============================================================
--  PetCare — Base de datos en Tercera Forma Normal (3FN)
--  Motor: MySQL 8.x
--  Grupo: EPMB01-3 | Politécnico Grancolombiano 2026
-- ============================================================

CREATE DATABASE IF NOT EXISTS petcare
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE petcare;

-- ============================================================
-- TABLA: usuarios
-- ============================================================
CREATE TABLE usuarios (
  id              INT           NOT NULL AUTO_INCREMENT,
  nombre          VARCHAR(100)  NOT NULL,
  email           VARCHAR(150)  NOT NULL UNIQUE,
  password_hash   VARCHAR(255)  NULL,
  foto_url        VARCHAR(255)  NULL,
  es_invitado     TINYINT(1)    NOT NULL DEFAULT 0,
  created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- ============================================================
-- TABLA: razas
-- Catálogo de razas de animales.
-- Separada de mascotas para evitar repetición de datos (2FN)
-- y eliminar dependencia transitiva nombre_raza → características.
-- ============================================================
CREATE TABLE razas (
  id                   INT           NOT NULL AUTO_INCREMENT,
  nombre               VARCHAR(100)  NOT NULL,
  tipo_animal          ENUM('perro','gato','otro') NOT NULL,
  tamanio              ENUM('pequeño','mediano','grande') NOT NULL,
  esperanza_vida       VARCHAR(20)   NULL,
  nivel_ejercicio      ENUM('bajo','medio','alto') NOT NULL,
  descripcion          TEXT          NULL,
  descripcion_detallada TEXT         NULL,
  imagen_url           VARCHAR(255)  NULL,
  PRIMARY KEY (id)
);

-- ============================================================
-- TABLA: recomendaciones_cuidado
-- Recomendaciones asociadas a una raza (1:N con razas).
-- ============================================================
CREATE TABLE recomendaciones_cuidado (
  id          INT           NOT NULL AUTO_INCREMENT,
  raza_id     INT           NOT NULL,
  titulo      VARCHAR(150)  NOT NULL,
  descripcion TEXT          NULL,
  icono       VARCHAR(50)   NULL,
  color       VARCHAR(20)   NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_rec_raza FOREIGN KEY (raza_id)
    REFERENCES razas (id) ON DELETE CASCADE
);

-- ============================================================
-- TABLA: cuidadores
-- ============================================================
CREATE TABLE cuidadores (
  id                    INT            NOT NULL AUTO_INCREMENT,
  nombre                VARCHAR(100)   NOT NULL,
  rol                   VARCHAR(100)   NOT NULL,
  ciudad                VARCHAR(100)   NOT NULL,
  calificacion          DECIMAL(2,1)   NULL,
  experiencia_anios     INT            NULL,
  descripcion           TEXT           NULL,
  telefono              VARCHAR(20)    NULL,
  whatsapp              VARCHAR(20)    NULL,
  foto_url              VARCHAR(255)   NULL,
  disponible            TINYINT(1)     NOT NULL DEFAULT 1,
  servicios_completados INT            NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
);

-- ============================================================
-- TABLA: mascotas
-- ============================================================
CREATE TABLE mascotas (
  id                 INT            NOT NULL AUTO_INCREMENT,
  usuario_id         INT            NOT NULL,
  raza_id            INT            NULL,
  nombre             VARCHAR(100)   NOT NULL,
  especie            VARCHAR(50)    NOT NULL,
  edad               INT            NULL,
  peso               DECIMAL(5,2)   NULL,
  sexo               ENUM('macho','hembra') NULL,
  dieta              VARCHAR(100)   NULL,
  vacunacion_al_dia  TINYINT(1)     NOT NULL DEFAULT 0,
  foto_url           VARCHAR(255)   NULL,
  notas              TEXT           NULL,
  created_at         TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_mascota_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id) ON DELETE CASCADE,
  CONSTRAINT fk_mascota_raza FOREIGN KEY (raza_id)
    REFERENCES razas (id) ON DELETE SET NULL
);

-- ============================================================
-- TABLA: mascotas_cuidadores
-- Relación M:N entre mascotas y cuidadores.
-- ============================================================
CREATE TABLE mascotas_cuidadores (
  mascota_id        INT   NOT NULL,
  cuidador_id       INT   NOT NULL,
  fecha_asignacion  DATE  NULL,
  PRIMARY KEY (mascota_id, cuidador_id),
  CONSTRAINT fk_mc_mascota FOREIGN KEY (mascota_id)
    REFERENCES mascotas (id) ON DELETE CASCADE,
  CONSTRAINT fk_mc_cuidador FOREIGN KEY (cuidador_id)
    REFERENCES cuidadores (id) ON DELETE CASCADE
);

-- ============================================================
-- TABLA: citas
-- Agenda de citas veterinarias/paseador por mascota.
-- ============================================================
CREATE TABLE citas (
  id           INT           NOT NULL AUTO_INCREMENT,
  mascota_id   INT           NOT NULL,
  fecha        DATETIME      NOT NULL,
  motivo       VARCHAR(200)  NOT NULL,
  profesional  VARCHAR(100)  NOT NULL,
  estado       ENUM('Programada','Confirmada','Completada','Cancelada')
               NOT NULL DEFAULT 'Programada',
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_cita_mascota FOREIGN KEY (mascota_id)
    REFERENCES mascotas (id) ON DELETE CASCADE
);

-- ============================================================
-- TABLA: tutoriales
-- ============================================================
CREATE TABLE tutoriales (
  id               INT            NOT NULL AUTO_INCREMENT,
  titulo           VARCHAR(200)   NOT NULL,
  descripcion      TEXT           NULL,
  duracion_min     INT            NULL,
  nivel_dificultad ENUM('facil','medio','dificil') NOT NULL,
  url_externo      VARCHAR(255)   NULL,
  thumbnail_url    VARCHAR(255)   NULL,
  PRIMARY KEY (id)
);

-- ============================================================
-- TABLA: recursos_veterinarios
-- ============================================================
CREATE TABLE recursos_veterinarios (
  id          INT           NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(200)  NOT NULL,
  descripcion TEXT          NULL,
  tipo        ENUM('clinica','guia','asociacion','otro') NOT NULL,
  url_externo VARCHAR(255)  NULL,
  PRIMARY KEY (id)
);

-- ============================================================
-- DATOS DE EJEMPLO
-- ============================================================

-- Usuario demo
INSERT INTO usuarios (nombre, email, password_hash, es_invitado) VALUES
('Demo Usuario', 'demo@petcare.com', '$2b$10$examplehashvalue', 0);

-- Razas (RF-05: mínimo 6)
INSERT INTO razas (nombre, tipo_animal, tamanio, esperanza_vida, nivel_ejercicio, descripcion, descripcion_detallada) VALUES
('Golden Retriever', 'perro', 'grande',  '10-12 años', 'alto',  'Perro inteligente, amigable y familiar.',        'El Golden Retriever es una de las razas más populares del mundo. Su carácter equilibrado y su facilidad de adiestramiento lo hacen ideal para familias con niños.'),
('Bulldog Francés',  'perro', 'pequeño', '10-12 años', 'bajo',  'Compacto, tranquilo y muy afectuoso.',           'El Bulldog Francés es un perro de compañía por excelencia. Adaptable a la vida en apartamento y muy leal a su familia.'),
('Beagle',           'perro', 'mediano', '12-15 años', 'medio', 'Curioso, alegre y excelente rastreador.',        'El Beagle es una raza de sabueso de tamaño mediano. Su naturaleza curiosa y su excelente olfato lo hacen único.'),
('Maine Coon',       'gato',  'grande',  '12-15 años', 'medio', 'Gato grande, sociable y juguetón.',              'El Maine Coon es una de las razas de gato más grandes. Es conocido por su pelaje largo, su carácter amigable y su inteligencia.'),
('Siamés',           'gato',  'mediano', '15-20 años', 'medio', 'Vocal, elegante y muy inteligente.',             'El gato Siamés es una de las razas más antiguas y reconocidas. Su pelaje de puntos y ojos azules lo hacen inconfundible.'),
('Periquito',        'otro',  'pequeño', '5-8 años',   'bajo',  'Ave pequeña, colorida y fácil de cuidar.',      'El periquito es el ave de compañía más popular del mundo. Es inteligente, sociable y puede aprender a imitar palabras.');

-- Recomendaciones de cuidado
INSERT INTO recomendaciones_cuidado (raza_id, titulo, descripcion, icono, color) VALUES
(1, 'Cepillado regular',  'Requiere cepillado mínimo 3 veces por semana.',      'cut-outline',        '#31d0cc'),
(1, 'Actividad física',   'Necesita 1-2 horas de ejercicio diario.',            'walk-outline',       '#4CAF50'),
(1, 'Control de peso',    'Propenso a la obesidad, controlar porciones.',        'scale-outline',      '#FF9800'),
(2, 'Limpieza facial',    'Limpiar los pliegues de la cara diariamente.',        'water-outline',      '#2196F3'),
(2, 'Evitar calor',       'Sensible a temperaturas altas, no exponerlo.',        'thermometer-outline','#f44336'),
(2, 'Ejercicio moderado', 'Paseos cortos, no actividad intensa.',                'walk-outline',       '#4CAF50'),
(3, 'Socialización',      'Necesita interacción constante con personas y perros.','people-outline',    '#9C27B0'),
(4, 'Cepillado profundo', 'Cepillar 2 veces por semana para evitar enredos.',    'cut-outline',        '#31d0cc'),
(5, 'Estimulación mental','Juegos interactivos para mantenerlo activo.',          'bulb-outline',       '#FF9800'),
(6, 'Jaula espaciosa',    'Necesita espacio para volar dentro del hogar.',        'home-outline',       '#4CAF50');

-- Cuidadores (RF-03: mínimo 4)
INSERT INTO cuidadores (nombre, rol, ciudad, calificacion, experiencia_anios, descripcion, telefono, whatsapp, disponible, servicios_completados) VALUES
('Carlos Pérez',  'Paseador Senior', 'Bucaramanga',  4.8, 5, 'Amante de los animales con más de 5 años paseando perros.', '3201112233', '3201112233', 1, 142),
('Ana Gómez',     'Veterinaria',     'Bogotá',        4.9, 8, 'Veterinaria especializada en animales de compañía.',         '3109988776', '3109988776', 1, 310),
('Luis Torres',   'Entrenador',      'Floridablanca', 4.7, 3, 'Entrenador conductual canino certificado.',                  '3154433221', '3154433221', 1,  87),
('María Ruiz',    'Paseadora',       'Medellín',      4.6, 2, 'Apasionada por el bienestar animal.',                       '3007766554', '3007766554', 0,  54);

-- Mascotas demo (asociadas al usuario 1)
INSERT INTO mascotas (usuario_id, raza_id, nombre, especie, edad, peso, sexo, dieta, vacunacion_al_dia, notas) VALUES
(1, 1, 'Max',   'Perro', 3, 28.5, 'macho',  'Croquetas premium + snacks', 1, 'Le encanta el agua y jugar con pelotas.'),
(1, 4, 'Luna',  'Gato',  2,  4.2, 'hembra', 'Mixta húmeda y seca',        1, 'Tímida con extraños pero muy cariñosa.'),
(1, 6, 'Pico',  'Ave',   1,  0.03,'macho',  'Semillas y frutas frescas',  0, 'Está aprendiendo a decir su nombre.');

-- Asignar cuidadores a mascotas
INSERT INTO mascotas_cuidadores (mascota_id, cuidador_id, fecha_asignacion) VALUES
(1, 1, '2026-01-15'),
(1, 2, '2026-03-01'),
(2, 2, '2026-02-10');

-- Citas demo
INSERT INTO citas (mascota_id, fecha, motivo, profesional, estado) VALUES
(1, '2026-06-15 10:00:00', 'Revisión anual',          'Ana Gómez',   'Programada'),
(1, '2026-06-20 14:30:00', 'Vacuna antirrábica',      'Ana Gómez',   'Confirmada'),
(2, '2026-06-18 09:00:00', 'Control de peso',         'Ana Gómez',   'Programada'),
(1, '2026-05-10 11:00:00', 'Desparasitación interna', 'Ana Gómez',   'Completada'),
(2, '2026-04-22 16:00:00', 'Limpieza dental',         'Carlos Pérez','Cancelada');

-- Tutoriales (RF-07: mínimo 5)
INSERT INTO tutoriales (titulo, descripcion, duracion_min, nivel_dificultad, url_externo) VALUES
('Cómo limpiar las orejas de tu perro',  'Guía paso a paso para la higiene auditiva.',    5, 'facil',   'https://www.youtube.com/watch?v=example1'),
('Higiene dental básica para mascotas',  'Técnicas de cepillado dental seguras.',          8, 'medio',   'https://www.youtube.com/watch?v=example2'),
('Primeros auxilios para tu mascota',    'Qué hacer en emergencias básicas.',             12, 'medio',   'https://www.youtube.com/watch?v=example3'),
('Alimentación saludable para gatos',    'Nutrición felina esencial.',                     6, 'facil',   'https://www.youtube.com/watch?v=example4'),
('Adiestramiento básico: comandos',      'Enseña sit, stay y down en casa.',              15, 'dificil', 'https://www.youtube.com/watch?v=example5');

-- Recursos veterinarios (RF-09: mínimo 4)
INSERT INTO recursos_veterinarios (nombre, descripcion, tipo, url_externo) VALUES
('Clínica VetCare Bogotá',  'Atención 24h para urgencias veterinarias.',           'clinica',    'https://vetcare.com.co'),
('WSAVA — Guías clínicas',  'Guías internacionales de salud animal.',              'guia',       'https://wsava.org/guidelines/'),
('AVMA',                    'Asociación Americana de Medicina Veterinaria.',       'asociacion', 'https://avma.org'),
('Sanidad Animal Colombia', 'Recursos del ICA sobre bienestar animal en Colombia.','guia',      'https://www.ica.gov.co');
