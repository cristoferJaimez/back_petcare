USE petcare;

DELIMITER $$

-- ============================================================
-- USUARIOS
-- ============================================================

CREATE PROCEDURE sp_usuario_obtener(IN p_id INT)
BEGIN
  SELECT id, nombre, email, foto_url, es_invitado, created_at
  FROM usuarios WHERE id = p_id;
END$$

CREATE PROCEDURE sp_usuario_obtener_por_email(IN p_email VARCHAR(150))
BEGIN
  SELECT * FROM usuarios WHERE email = p_email;
END$$

CREATE PROCEDURE sp_usuario_crear(
  IN p_nombre       VARCHAR(100),
  IN p_email        VARCHAR(150),
  IN p_password_hash VARCHAR(255),
  IN p_es_invitado  TINYINT
)
BEGIN
  INSERT INTO usuarios (nombre, email, password_hash, es_invitado)
  VALUES (p_nombre, p_email, p_password_hash, p_es_invitado);
  SELECT id, nombre, email, foto_url, es_invitado, created_at
  FROM usuarios WHERE id = LAST_INSERT_ID();
END$$

CREATE PROCEDURE sp_usuario_actualizar(
  IN p_id       INT,
  IN p_nombre   VARCHAR(100),
  IN p_email    VARCHAR(150),
  IN p_foto_url VARCHAR(255)
)
BEGIN
  UPDATE usuarios
  SET nombre = p_nombre, email = p_email, foto_url = p_foto_url
  WHERE id = p_id;
  SELECT id, nombre, email, foto_url, es_invitado, created_at
  FROM usuarios WHERE id = p_id;
END$$

CREATE PROCEDURE sp_usuario_eliminar(IN p_id INT)
BEGIN
  DELETE FROM usuarios WHERE id = p_id;
END$$

-- ============================================================
-- MASCOTAS
-- ============================================================

CREATE PROCEDURE sp_mascotas_listar(IN p_usuario_id INT)
BEGIN
  SELECT m.*, r.nombre AS raza_nombre
  FROM mascotas m
  LEFT JOIN razas r ON r.id = m.raza_id
  WHERE m.usuario_id = p_usuario_id;
END$$

CREATE PROCEDURE sp_mascota_obtener(IN p_id INT)
BEGIN
  SELECT m.*, r.nombre AS raza_nombre,
         c.nombre AS cuidador_nombre, c.rol AS cuidador_rol, c.ciudad AS cuidador_ciudad
  FROM mascotas m
  LEFT JOIN razas r ON r.id = m.raza_id
  LEFT JOIN mascotas_cuidadores mc ON mc.mascota_id = m.id
  LEFT JOIN cuidadores c ON c.id = mc.cuidador_id
  WHERE m.id = p_id;
END$$

CREATE PROCEDURE sp_mascota_crear(
  IN p_usuario_id  INT,
  IN p_raza_id     INT,
  IN p_nombre      VARCHAR(100),
  IN p_especie     VARCHAR(50),
  IN p_edad        INT,
  IN p_peso        DECIMAL(5,2),
  IN p_sexo        ENUM('macho','hembra'),
  IN p_dieta       VARCHAR(100),
  IN p_vacunacion  TINYINT,
  IN p_foto_url    VARCHAR(255),
  IN p_notas       TEXT
)
BEGIN
  INSERT INTO mascotas
    (usuario_id, raza_id, nombre, especie, edad, peso, sexo, dieta, vacunacion_al_dia, foto_url, notas)
  VALUES
    (p_usuario_id, p_raza_id, p_nombre, p_especie, p_edad, p_peso, p_sexo, p_dieta, p_vacunacion, p_foto_url, p_notas);
  CALL sp_mascota_obtener(LAST_INSERT_ID());
END$$

CREATE PROCEDURE sp_mascota_actualizar(
  IN p_id         INT,
  IN p_nombre     VARCHAR(100),
  IN p_especie    VARCHAR(50),
  IN p_edad       INT,
  IN p_peso       DECIMAL(5,2),
  IN p_dieta      VARCHAR(100),
  IN p_vacunacion TINYINT,
  IN p_foto_url   VARCHAR(255),
  IN p_notas      TEXT
)
BEGIN
  UPDATE mascotas
  SET nombre = p_nombre, especie = p_especie, edad = p_edad, peso = p_peso,
      dieta = p_dieta, vacunacion_al_dia = p_vacunacion,
      foto_url = p_foto_url, notas = p_notas
  WHERE id = p_id;
  CALL sp_mascota_obtener(p_id);
END$$

CREATE PROCEDURE sp_mascota_eliminar(IN p_id INT)
BEGIN
  DELETE FROM mascotas WHERE id = p_id;
END$$

-- ============================================================
-- MASCOTAS ↔ CUIDADORES
-- ============================================================

CREATE PROCEDURE sp_mascota_asignar_cuidador(
  IN p_mascota_id  INT,
  IN p_cuidador_id INT,
  IN p_fecha       DATE
)
BEGIN
  INSERT INTO mascotas_cuidadores (mascota_id, cuidador_id, fecha_asignacion)
  VALUES (p_mascota_id, p_cuidador_id, p_fecha)
  ON DUPLICATE KEY UPDATE fecha_asignacion = p_fecha;
END$$

CREATE PROCEDURE sp_mascota_desasignar_cuidador(
  IN p_mascota_id  INT,
  IN p_cuidador_id INT
)
BEGIN
  DELETE FROM mascotas_cuidadores
  WHERE mascota_id = p_mascota_id AND cuidador_id = p_cuidador_id;
END$$

CREATE PROCEDURE sp_mascota_listar_cuidadores(IN p_mascota_id INT)
BEGIN
  SELECT c.*, mc.fecha_asignacion
  FROM cuidadores c
  INNER JOIN mascotas_cuidadores mc ON mc.cuidador_id = c.id
  WHERE mc.mascota_id = p_mascota_id;
END$$

-- ============================================================
-- CUIDADORES
-- ============================================================

CREATE PROCEDURE sp_cuidadores_listar()
BEGIN
  SELECT * FROM cuidadores;
END$$

CREATE PROCEDURE sp_cuidadores_listar_disponibles()
BEGIN
  SELECT * FROM cuidadores WHERE disponible = 1;
END$$

CREATE PROCEDURE sp_cuidador_obtener(IN p_id INT)
BEGIN
  SELECT * FROM cuidadores WHERE id = p_id;
END$$

CREATE PROCEDURE sp_cuidador_crear(
  IN p_nombre                VARCHAR(100),
  IN p_rol                   VARCHAR(100),
  IN p_ciudad                VARCHAR(100),
  IN p_calificacion          DECIMAL(2,1),
  IN p_experiencia           INT,
  IN p_descripcion           TEXT,
  IN p_telefono              VARCHAR(20),
  IN p_whatsapp              VARCHAR(20),
  IN p_foto_url              VARCHAR(255),
  IN p_disponible            TINYINT,
  IN p_servicios_completados INT
)
BEGIN
  INSERT INTO cuidadores
    (nombre, rol, ciudad, calificacion, experiencia_anios, descripcion,
     telefono, whatsapp, foto_url, disponible, servicios_completados)
  VALUES
    (p_nombre, p_rol, p_ciudad, p_calificacion, p_experiencia, p_descripcion,
     p_telefono, p_whatsapp, p_foto_url, p_disponible, p_servicios_completados);
  SELECT * FROM cuidadores WHERE id = LAST_INSERT_ID();
END$$

CREATE PROCEDURE sp_cuidador_actualizar(
  IN p_id           INT,
  IN p_nombre       VARCHAR(100),
  IN p_rol          VARCHAR(100),
  IN p_ciudad       VARCHAR(100),
  IN p_calificacion DECIMAL(2,1),
  IN p_disponible   TINYINT
)
BEGIN
  UPDATE cuidadores
  SET nombre = p_nombre, rol = p_rol, ciudad = p_ciudad,
      calificacion = p_calificacion, disponible = p_disponible
  WHERE id = p_id;
  SELECT * FROM cuidadores WHERE id = p_id;
END$$

CREATE PROCEDURE sp_cuidador_incrementar_servicios(IN p_id INT)
BEGIN
  UPDATE cuidadores
  SET servicios_completados = servicios_completados + 1
  WHERE id = p_id;
END$$

CREATE PROCEDURE sp_cuidador_eliminar(IN p_id INT)
BEGIN
  DELETE FROM cuidadores WHERE id = p_id;
END$$

-- ============================================================
-- RAZAS
-- ============================================================

CREATE PROCEDURE sp_razas_listar(IN p_tipo VARCHAR(20))
BEGIN
  IF p_tipo IS NULL THEN
    SELECT * FROM razas;
  ELSE
    SELECT * FROM razas WHERE tipo_animal = p_tipo;
  END IF;
END$$

CREATE PROCEDURE sp_raza_obtener(IN p_id INT)
BEGIN
  SELECT * FROM razas WHERE id = p_id;
END$$

CREATE PROCEDURE sp_raza_recomendaciones(IN p_raza_id INT)
BEGIN
  SELECT * FROM recomendaciones_cuidado WHERE raza_id = p_raza_id;
END$$

CREATE PROCEDURE sp_raza_crear(
  IN p_nombre               VARCHAR(100),
  IN p_tipo                 ENUM('perro','gato','otro'),
  IN p_tamanio              ENUM('pequeño','mediano','grande'),
  IN p_esperanza            VARCHAR(20),
  IN p_ejercicio            ENUM('bajo','medio','alto'),
  IN p_descripcion          TEXT,
  IN p_descripcion_detallada TEXT,
  IN p_imagen_url           VARCHAR(255)
)
BEGIN
  INSERT INTO razas
    (nombre, tipo_animal, tamanio, esperanza_vida, nivel_ejercicio,
     descripcion, descripcion_detallada, imagen_url)
  VALUES
    (p_nombre, p_tipo, p_tamanio, p_esperanza, p_ejercicio,
     p_descripcion, p_descripcion_detallada, p_imagen_url);
  SELECT * FROM razas WHERE id = LAST_INSERT_ID();
END$$

CREATE PROCEDURE sp_raza_actualizar(
  IN p_id                   INT,
  IN p_nombre               VARCHAR(100),
  IN p_descripcion          TEXT,
  IN p_descripcion_detallada TEXT
)
BEGIN
  UPDATE razas
  SET nombre = p_nombre, descripcion = p_descripcion,
      descripcion_detallada = p_descripcion_detallada
  WHERE id = p_id;
  SELECT * FROM razas WHERE id = p_id;
END$$

CREATE PROCEDURE sp_raza_eliminar(IN p_id INT)
BEGIN
  DELETE FROM razas WHERE id = p_id;
END$$

-- ============================================================
-- CITAS
-- ============================================================

CREATE PROCEDURE sp_citas_listar_por_mascota(IN p_mascota_id INT)
BEGIN
  SELECT * FROM citas WHERE mascota_id = p_mascota_id ORDER BY fecha DESC;
END$$

CREATE PROCEDURE sp_citas_listar_por_usuario(IN p_usuario_id INT)
BEGIN
  SELECT c.*, m.nombre AS mascota_nombre
  FROM citas c
  INNER JOIN mascotas m ON m.id = c.mascota_id
  WHERE m.usuario_id = p_usuario_id
  ORDER BY c.fecha DESC;
END$$

CREATE PROCEDURE sp_cita_obtener(IN p_id INT)
BEGIN
  SELECT c.*, m.nombre AS mascota_nombre
  FROM citas c
  INNER JOIN mascotas m ON m.id = c.mascota_id
  WHERE c.id = p_id;
END$$

CREATE PROCEDURE sp_cita_crear(
  IN p_mascota_id  INT,
  IN p_fecha       DATETIME,
  IN p_motivo      VARCHAR(200),
  IN p_profesional VARCHAR(100),
  IN p_estado      ENUM('Programada','Confirmada','Completada','Cancelada')
)
BEGIN
  INSERT INTO citas (mascota_id, fecha, motivo, profesional, estado)
  VALUES (p_mascota_id, p_fecha, p_motivo, p_profesional, p_estado);
  CALL sp_cita_obtener(LAST_INSERT_ID());
END$$

CREATE PROCEDURE sp_cita_actualizar_estado(
  IN p_id     INT,
  IN p_estado ENUM('Programada','Confirmada','Completada','Cancelada')
)
BEGIN
  UPDATE citas SET estado = p_estado WHERE id = p_id;
  CALL sp_cita_obtener(p_id);
END$$

CREATE PROCEDURE sp_cita_actualizar(
  IN p_id          INT,
  IN p_fecha       DATETIME,
  IN p_motivo      VARCHAR(200),
  IN p_profesional VARCHAR(100),
  IN p_estado      ENUM('Programada','Confirmada','Completada','Cancelada')
)
BEGIN
  UPDATE citas
  SET fecha = p_fecha, motivo = p_motivo, profesional = p_profesional, estado = p_estado
  WHERE id = p_id;
  CALL sp_cita_obtener(p_id);
END$$

CREATE PROCEDURE sp_cita_eliminar(IN p_id INT)
BEGIN
  DELETE FROM citas WHERE id = p_id;
END$$

-- ============================================================
-- TUTORIALES
-- ============================================================

CREATE PROCEDURE sp_tutoriales_listar(IN p_nivel VARCHAR(20))
BEGIN
  IF p_nivel IS NULL THEN
    SELECT * FROM tutoriales;
  ELSE
    SELECT * FROM tutoriales WHERE nivel_dificultad = p_nivel;
  END IF;
END$$

CREATE PROCEDURE sp_tutorial_obtener(IN p_id INT)
BEGIN
  SELECT * FROM tutoriales WHERE id = p_id;
END$$

CREATE PROCEDURE sp_tutorial_crear(
  IN p_titulo     VARCHAR(200),
  IN p_descripcion TEXT,
  IN p_duracion   INT,
  IN p_nivel      ENUM('facil','medio','dificil'),
  IN p_url        VARCHAR(255),
  IN p_thumbnail  VARCHAR(255)
)
BEGIN
  INSERT INTO tutoriales (titulo, descripcion, duracion_min, nivel_dificultad, url_externo, thumbnail_url)
  VALUES (p_titulo, p_descripcion, p_duracion, p_nivel, p_url, p_thumbnail);
  SELECT * FROM tutoriales WHERE id = LAST_INSERT_ID();
END$$

CREATE PROCEDURE sp_tutorial_actualizar(
  IN p_id          INT,
  IN p_titulo      VARCHAR(200),
  IN p_descripcion TEXT,
  IN p_duracion    INT
)
BEGIN
  UPDATE tutoriales
  SET titulo = p_titulo, descripcion = p_descripcion, duracion_min = p_duracion
  WHERE id = p_id;
  SELECT * FROM tutoriales WHERE id = p_id;
END$$

CREATE PROCEDURE sp_tutorial_eliminar(IN p_id INT)
BEGIN
  DELETE FROM tutoriales WHERE id = p_id;
END$$

-- ============================================================
-- RECURSOS VETERINARIOS
-- ============================================================

CREATE PROCEDURE sp_recursos_listar(IN p_tipo VARCHAR(20))
BEGIN
  IF p_tipo IS NULL THEN
    SELECT * FROM recursos_veterinarios;
  ELSE
    SELECT * FROM recursos_veterinarios WHERE tipo = p_tipo;
  END IF;
END$$

CREATE PROCEDURE sp_recurso_obtener(IN p_id INT)
BEGIN
  SELECT * FROM recursos_veterinarios WHERE id = p_id;
END$$

CREATE PROCEDURE sp_recurso_crear(
  IN p_nombre      VARCHAR(200),
  IN p_descripcion TEXT,
  IN p_tipo        ENUM('clinica','guia','asociacion','otro'),
  IN p_url         VARCHAR(255)
)
BEGIN
  INSERT INTO recursos_veterinarios (nombre, descripcion, tipo, url_externo)
  VALUES (p_nombre, p_descripcion, p_tipo, p_url);
  SELECT * FROM recursos_veterinarios WHERE id = LAST_INSERT_ID();
END$$

CREATE PROCEDURE sp_recurso_actualizar(
  IN p_id          INT,
  IN p_nombre      VARCHAR(200),
  IN p_descripcion TEXT
)
BEGIN
  UPDATE recursos_veterinarios
  SET nombre = p_nombre, descripcion = p_descripcion
  WHERE id = p_id;
  SELECT * FROM recursos_veterinarios WHERE id = p_id;
END$$

CREATE PROCEDURE sp_recurso_eliminar(IN p_id INT)
BEGIN
  DELETE FROM recursos_veterinarios WHERE id = p_id;
END$$

DELIMITER ;
