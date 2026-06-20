let razas = [
  { id: 1, nombre: 'Golden Retriever', tipo_animal: 'perro', tamanio: 'grande', esperanza_vida: '10-12 años', nivel_ejercicio: 'alto', descripcion: 'Perro inteligente, amigable y familiar.', imagen_url: null },
  { id: 2, nombre: 'Bulldog Francés', tipo_animal: 'perro', tamanio: 'pequeño', esperanza_vida: '10-12 años', nivel_ejercicio: 'bajo', descripcion: 'Compacto, tranquilo y muy afectuoso.', imagen_url: null },
  { id: 3, nombre: 'Beagle', tipo_animal: 'perro', tamanio: 'mediano', esperanza_vida: '12-15 años', nivel_ejercicio: 'medio', descripcion: 'Curioso, alegre y excelente rastreador.', imagen_url: null },
  { id: 4, nombre: 'Maine Coon', tipo_animal: 'gato', tamanio: 'grande', esperanza_vida: '12-15 años', nivel_ejercicio: 'medio', descripcion: 'Gato grande, sociable y juguetón.', imagen_url: null },
  { id: 5, nombre: 'Siamés', tipo_animal: 'gato', tamanio: 'mediano', esperanza_vida: '15-20 años', nivel_ejercicio: 'medio', descripcion: 'Vocal, elegante y muy inteligente.', imagen_url: null },
  { id: 6, nombre: 'Periquito', tipo_animal: 'otro', tamanio: 'pequeño', esperanza_vida: '5-8 años', nivel_ejercicio: 'bajo', descripcion: 'Ave pequeña, colorida y fácil de cuidar.', imagen_url: null },
  { id: 7, nombre: 'Labrador Retriever', tipo_animal: 'perro', tamanio: 'grande', esperanza_vida: '10-14 años', nivel_ejercicio: 'alto', descripcion: 'Equilibrado, sociable y muy receptivo al entrenamiento.', imagen_url: null },
  { id: 8, nombre: 'Persa', tipo_animal: 'gato', tamanio: 'mediano', esperanza_vida: '12-17 años', nivel_ejercicio: 'bajo', descripcion: 'Tranquilo, hogareño y de mantenimiento estético constante.', imagen_url: null },
  { id: 9, nombre: 'Canario', tipo_animal: 'ave', tamanio: 'pequeño', esperanza_vida: '8-12 años', nivel_ejercicio: 'bajo', descripcion: 'Ave de canto armonioso que requiere ambiente limpio y estable.', imagen_url: null },
];

let recomendaciones = [
  { id: 1, raza_id: 1, titulo: 'Cepillado regular', descripcion: 'Requiere cepillado mínimo 3 veces por semana.' },
  { id: 2, raza_id: 1, titulo: 'Actividad física', descripcion: 'Necesita 1-2 horas de ejercicio diario.' },
  { id: 3, raza_id: 1, titulo: 'Control de peso', descripcion: 'Propenso a la obesidad, controlar porciones.' },
  { id: 4, raza_id: 2, titulo: 'Limpieza facial', descripcion: 'Limpiar los pliegues de la cara diariamente.' },
  { id: 5, raza_id: 2, titulo: 'Evitar calor', descripcion: 'Sensible a temperaturas altas, no exponerlo.' },
  { id: 6, raza_id: 2, titulo: 'Ejercicio moderado', descripcion: 'Paseos cortos, no actividad intensa.' },
  { id: 7, raza_id: 4, titulo: 'Cepillado largo', descripcion: 'Cepillado varias veces por semana para evitar nudos.' },
  { id: 8, raza_id: 5, titulo: 'Estimulación mental', descripcion: 'Necesita juegos interactivos y retos suaves diarios.' },
  { id: 9, raza_id: 9, titulo: 'Control ambiental', descripcion: 'Evitar corrientes de aire y cambios bruscos de temperatura.' },
];

module.exports = { razas, recomendaciones };
