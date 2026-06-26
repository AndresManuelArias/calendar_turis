-- Seed: Datos iniciales para desarrollo de Agenda Lugar

-- ============================================================
-- Ciudades
-- ============================================================
INSERT INTO ciudades (id, nombre, estado, pais) VALUES
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Bogotá', 'Bogotá D.C.', 'Colombia'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'Medellín', 'Antioquia', 'Colombia'),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'Cali', 'Valle del Cauca', 'Colombia'),
  ('a1b2c3d4-0000-0000-0000-000000000004', 'Barranquilla', 'Atlántico', 'Colombia'),
  ('a1b2c3d4-0000-0000-0000-000000000005', 'Cartagena', 'Bolívar', 'Colombia'),
  ('a1b2c3d4-0000-0000-0000-000000000006', 'Rionegro', 'Antioquia', 'Colombia'),
  ('a1b2c3d4-0000-0000-0000-000000000007', 'Salta', 'Salta', 'Argentina')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Intereses / Categorías
-- ============================================================
INSERT INTO intereses (id, nombre, descripcion) VALUES
  ('b1b2c3d4-0000-0000-0000-000000000001', 'Música', 'Conciertos, festivales y presentaciones musicales'),
  ('b1b2c3d4-0000-0000-0000-000000000002', 'Tecnología', 'Eventos de tech, startups e innovación'),
  ('b1b2c3d4-0000-0000-0000-000000000003', 'Arte', 'Exposiciones, galerías y eventos culturales'),
  ('b1b2c3d4-0000-0000-0000-000000000004', 'Gastronomía', 'Ferias gastronómicas y catas'),
  ('b1b2c3d4-0000-0000-0000-000000000005', 'Deportes', 'Eventos deportivos y competencias')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Usuario organizador de prueba
-- ============================================================
INSERT INTO usuarios (id, nombre, email, contrasenia_hash, fecha_registro) VALUES
  ('c1b2c3d4-0000-0000-0000-000000000001', 'Carlos Productor', 'carlos@email.com', 'hash_de_prueba_123', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO organizadores (id, nit_o_rut, telefono_contacto, sitio_web) VALUES
  ('c1b2c3d4-0000-0000-0000-000000000001', '123456789-0', '+57 300 123 4567', 'https://carlosproductor.co')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Eventos
-- ============================================================

-- Evento 1: Hoy - Bogotá - Música (pago, con detalle completo)
INSERT INTO eventos (id, titulo, objetivo, publico_objetivo, descripcion_itinerario, fecha_inicio, fecha_fin, lugar_direccion, costo_entrada, es_gratuito, url_ticketera_externa, observaciones, ciudad_id, organizador_id) VALUES
  ('d1b2c3d4-0000-0000-0000-000000000001',
   'Festival de Jazz al Parque',
   'Difundir la cultura del jazz en la ciudad con artistas nacionales e internacionales',
   'Jóvenes y adultos amantes de la música en vivo',
   '10:00 Apertura de puertas\n11:00 Banda de apertura (Jazz Fusión)\n13:00 Taller de improvisación\n15:00 Artista principal (Sexteto de Jazz)\n17:00 Jam session abierta\n19:00 Cierre',
   CURRENT_DATE + TIME '10:00:00',
   CURRENT_DATE + TIME '20:00:00',
   'Parque El Virrey, Carrera 15 # 87-60',
   45000, false, 'https://ticketera.com/jazz-al-parque',
   'Llevar ropa cómoda y gorra. Habrá zonas de comida.',
   'a1b2c3d4-0000-0000-0000-000000000001',
   'c1b2c3d4-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Evento 2: Hoy - Medellín - Tecnología (gratuito)
INSERT INTO eventos (id, titulo, objetivo, publico_objetivo, descripcion_itinerario, fecha_inicio, fecha_fin, lugar_direccion, costo_entrada, es_gratuito, url_ticketera_externa, observaciones, ciudad_id, organizador_id) VALUES
  ('d1b2c3d4-0000-0000-0000-000000000002',
   'Meetup de Desarrollo Web 2026',
   'Compartir conocimientos sobre las últimas tendencias en desarrollo web',
   'Desarrolladores, estudiantes de sistemas y entusiastas tech',
   '09:00 Registro y café\n09:30 Charla: Next.js 16 en producción\n11:00 Taller práctico de React Server Components\n13:00 Networking y almuerzo\n14:30 Panel: El futuro del frontend\n16:00 Cierre',
   CURRENT_DATE + TIME '09:00:00',
   CURRENT_DATE + TIME '16:00:00',
   'Universidad EAFIT, Bloque 38, Auditorio 101',
   0, true, NULL,
   'Cupo limitado. Inscripción previa requerida en la página del evento.',
   'a1b2c3d4-0000-0000-0000-000000000002',
   'c1b2c3d4-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Evento 3: Hoy - Cartagena - Arte (gratuito, para probar detalle gratuito)
INSERT INTO eventos (id, titulo, objetivo, publico_objetivo, descripcion_itinerario, fecha_inicio, fecha_fin, lugar_direccion, costo_entrada, es_gratuito, url_ticketera_externa, observaciones, ciudad_id, organizador_id) VALUES
  ('d1b2c3d4-0000-0000-0000-000000000003',
   'Exposición de Arte Contemporáneo Caribe',
   'Mostrar el talento de artistas emergentes de la región Caribe',
   'Público general interesado en arte y cultura',
   '10:00 Apertura de galería\n11:00 Recorrido guiado con los artistas\n14:00 Conversatorio: Arte e identidad Caribe\n16:00 Performance en vivo\n18:00 Cierre',
   CURRENT_DATE + TIME '10:00:00',
   CURRENT_DATE + TIME '18:00:00',
   'Museo de Arte Moderno de Cartagena, Centro Histórico',
   0, true, NULL,
   'Entrada libre. Se agradece donación voluntaria.',
   'a1b2c3d4-0000-0000-0000-000000000005',
   'c1b2c3d4-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Evento 4: Fin de semana próximo - Cali - Arte + Gastronomía (para probar HU02+HU03)
INSERT INTO eventos (id, titulo, objetivo, publico_objetivo, descripcion_itinerario, fecha_inicio, fecha_fin, lugar_direccion, costo_entrada, es_gratuito, url_ticketera_externa, observaciones, ciudad_id, organizador_id) VALUES
  ('d1b2c3d4-0000-0000-0000-000000000004',
   'Feria Gastronómica y Cultural de Cali',
   'Promover la gastronomía local y la cultura caleña',
   'Familias, turistas y amantes de la buena comida',
   'Sábado:\n10:00 Apertura de stands\n12:00 Concurso de cocina en vivo\n15:00 Muestra de bailes tradicionales\n18:00 Concierto de salsa\n\nDomingo:\n10:00 Taller de cocina tradicional\n14:00 Cata de vinos y café\n17:00 Cierre con espectáculo',
   CURRENT_DATE + INTERVAL '3 days' + TIME '10:00:00',
   CURRENT_DATE + INTERVAL '4 days' + TIME '19:00:00',
   'Centro de Eventos Valle del Cauca, Cali',
   35000, false, 'https://ticketera.com/feria-cali',
   'Menores de 12 años ingresan gratis. Incluye degustación.',
   'a1b2c3d4-0000-0000-0000-000000000003',
   'c1b2c3d4-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Evento 5: En 2 semanas - Barranquilla - Deportes (para probar HU02 fechas lejanas)
INSERT INTO eventos (id, titulo, objetivo, publico_objetivo, descripcion_itinerario, fecha_inicio, fecha_fin, lugar_direccion, costo_entrada, es_gratuito, url_ticketera_externa, observaciones, ciudad_id, organizador_id) VALUES
  ('d1b2c3d4-0000-0000-0000-000000000005',
   'Maratón Internacional de Barranquilla',
   'Fomentar la actividad física y el turismo deportivo en la ciudad',
   'Corredores profesionales y aficionados de todas las edades',
   '05:00 Concentración y entrega de kits\n06:00 Calentamiento grupal\n06:30 Largada 42K\n06:35 Largada 21K\n07:00 Largada 10K\n09:00 Premiación\n10:00 Feria de deportes',
   CURRENT_DATE + INTERVAL '14 days' + TIME '05:00:00',
   CURRENT_DATE + INTERVAL '14 days' + TIME '12:00:00',
   'Estadio Metropolitano Roberto Meléndez, Vía 40',
   80000, false, 'https://ticketera.com/maraton-bq',
   'Incluye kit de corredor, hidratación y medalla de participación.',
   'a1b2c3d4-0000-0000-0000-000000000004',
   'c1b2c3d4-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Evento 7: Hoy - Rionegro - Música (festival al aire libre, pago con detalle)
INSERT INTO eventos (id, titulo, objetivo, publico_objetivo, descripcion_itinerario, fecha_inicio, fecha_fin, lugar_direccion, costo_entrada, es_gratuito, url_ticketera_externa, observaciones, ciudad_id, organizador_id) VALUES
  ('d1b2c3d4-0000-0000-0000-000000000007',
   'Rionegro Music Festival',
   'Reunir a las mejores bandas emergentes del oriente antioqueño en un solo escenario',
   'Jóvenes y adultos amantes de la música alternativa y rock',
   '12:00 Apertura de puertas\n13:00 Banda local: Los del Valle\n15:00 Concurso de bandas\n17:30 Artista invitado nacional\n19:00 DJ set electrónico\n21:00 Cierre',
   CURRENT_DATE + TIME '12:00:00',
   CURRENT_DATE + TIME '21:00:00',
   'Parque Principal de Rionegro, Carrera 50 # 30-10',
   25000, false, 'https://ticketera.com/rionegro-music',
   'Menores de edad acompañados de adulto responsable. Llevar silla de playa.',
   'a1b2c3d4-0000-0000-0000-000000000006',
   'c1b2c3d4-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Evento 8: Hoy - Rionegro - Gastronomía (gratuito)
INSERT INTO eventos (id, titulo, objetivo, publico_objetivo, descripcion_itinerario, fecha_inicio, fecha_fin, lugar_direccion, costo_entrada, es_gratuito, url_ticketera_externa, observaciones, ciudad_id, organizador_id) VALUES
  ('d1b2c3d4-0000-0000-0000-000000000008',
   'Mercado Campesino Rionegro',
   'Promover los productos agrícolas locales y la gastronomía tradicional antioqueña',
   'Familias, turistas y amantes de la cocina tradicional',
   '07:00 Instalación de puestos\n09:00 Apertura al público\n11:00 Taller de cocina con productos locales\n14:00 Cata de café de la región\n16:00 Muestra de artesanías\n18:00 Cierre',
   CURRENT_DATE + TIME '07:00:00',
   CURRENT_DATE + TIME '18:00:00',
   'Plaza de Mercado de Rionegro, Calle 40 # 45-20',
   0, true, NULL,
   'Entrada libre. Productos disponibles para la venta directa.',
   'a1b2c3d4-0000-0000-0000-000000000006',
   'c1b2c3d4-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Evento 9: Próximo fin de semana - Rionegro - Deportes
INSERT INTO eventos (id, titulo, objetivo, publico_objetivo, descripcion_itinerario, fecha_inicio, fecha_fin, lugar_direccion, costo_entrada, es_gratuito, url_ticketera_externa, observaciones, ciudad_id, organizador_id) VALUES
  ('d1b2c3d4-0000-0000-0000-000000000009',
   'Travesía Ecológica Oriente Antioqueño',
   'Fomentar el ecoturismo y la actividad física al aire libre en las montañas de Rionegro',
   'Amantes del senderismo, naturaleza y deportes al aire libre',
   'Día 1:\n06:00 Punto de encuentro\n07:00 Inicio de caminata\n10:00 Llegada a mirador\n12:00 Almuerzo campestre\n14:00 Taller de avistamiento de aves\n18:00 Fogata y camping\n\nDía 2:\n07:00 Desayuno\n09:00 Descenso\n12:00 Cierre y transporte de regreso',
   CURRENT_DATE + INTERVAL '2 days' + TIME '06:00:00',
   CURRENT_DATE + INTERVAL '3 days' + TIME '12:00:00',
   'Vereda San Nicolás, Rionegro (Salida desde el Parque Principal)',
   65000, false, 'https://ticketera.com/travesia-rionegro',
   'Incluye guía, alimentación y equipo de camping. No incluye transporte.',
   'a1b2c3d4-0000-0000-0000-000000000006',
   'c1b2c3d4-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Evento 10: En 10 días - Rionegro - Tecnología
INSERT INTO eventos (id, titulo, objetivo, publico_objetivo, descripcion_itinerario, fecha_inicio, fecha_fin, lugar_direccion, costo_entrada, es_gratuito, url_ticketera_externa, observaciones, ciudad_id, organizador_id) VALUES
  ('d1b2c3d4-0000-0000-0000-000000000010',
   'Congreso de Innovación Tecnológica Oriente',
   'Conectar a emprendedores e innovadores del oriente antioqueño con la industria tech',
   'Emprendedores, desarrolladores, estudiantes y empresarios',
   '08:00 Registro\n09:00 Charla inaugural: El futuro del trabajo\n10:30 Taller de IA para negocios\n12:00 Networking lunch\n14:00 Panel: Startups que transforman\n15:30 Demo day de proyectos locales\n17:00 Premiación y cierre',
   CURRENT_DATE + INTERVAL '10 days' + TIME '08:00:00',
   CURRENT_DATE + INTERVAL '10 days' + TIME '17:00:00',
   'Centro de Convenciones de Rionegro, Vía Aeropuerto',
   80000, false, 'https://ticketera.com/congreso-tech-oriente',
   'Cupos limitados. Incluye certificado de asistencia.',
   'a1b2c3d4-0000-0000-0000-000000000006',
   'c1b2c3d4-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Actividades del Rionegro Music Festival
INSERT INTO actividades (id, nombre, descripcion, hora_inicio, hora_fin, evento_id) VALUES
  ('e1b2c3d4-0000-0000-0000-000000000006', 'Apertura de puertas', 'Ingreso y registro de asistentes', '12:00', '13:00', 'd1b2c3d4-0000-0000-0000-000000000007'),
  ('e1b2c3d4-0000-0000-0000-000000000007', 'Los del Valle (banda local)', 'Presentación de la banda ganadora del concurso local', '13:00', '14:30', 'd1b2c3d4-0000-0000-0000-000000000007'),
  ('e1b2c3d4-0000-0000-0000-000000000008', 'Concurso de bandas', 'Competencia de bandas emergentes del oriente', '15:00', '17:00', 'd1b2c3d4-0000-0000-0000-000000000007'),
  ('e1b2c3d4-0000-0000-0000-000000000009', 'Artista invitado nacional', 'Presentación estelar del grupo invitado', '17:30', '19:00', 'd1b2c3d4-0000-0000-0000-000000000007'),
  ('e1b2c3d4-0000-0000-0000-000000000010', 'DJ set electrónico', 'Cierre musical a cargo de DJ invitado', '19:00', '21:00', 'd1b2c3d4-0000-0000-0000-000000000007')
ON CONFLICT (id) DO NOTHING;

-- Media del Rionegro Music Festival
INSERT INTO media (id, url_archivo, tipo, evento_id) VALUES
  ('f1b2c3d4-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800', 'IMAGEN', 'd1b2c3d4-0000-0000-0000-000000000007'),
  ('f1b2c3d4-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800', 'IMAGEN', 'd1b2c3d4-0000-0000-0000-000000000007'),
  ('f1b2c3d4-0000-0000-0000-000000000007', 'https://www.youtube.com/embed/jfKfPfyJRdk', 'VIDEO_EMBEDDED', 'd1b2c3d4-0000-0000-0000-000000000007')
ON CONFLICT (id) DO NOTHING;

-- Participantes del Rionegro Music Festival
INSERT INTO participantes (id, nombre, rol_o_perfil, evento_id) VALUES
  ('a2b2c3d4-0000-0000-0000-000000000005', 'Luis Fernando Mejía', 'Director del Festival', 'd1b2c3d4-0000-0000-0000-000000000007'),
  ('a2b2c3d4-0000-0000-0000-000000000006', 'Carolina Giraldo', 'Artista Invitada Nacional', 'd1b2c3d4-0000-0000-0000-000000000007'),
  ('a2b2c3d4-0000-0000-0000-000000000007', 'DJ Ríos', 'DJ Electrónico Principal', 'd1b2c3d4-0000-0000-0000-000000000007')
ON CONFLICT (id) DO NOTHING;

-- Patrocinadores del Rionegro Music Festival
INSERT INTO patrocinadores (id, nombre, logo_url, descripcion, sitio_web, evento_id) VALUES
  ('a3b2c3d4-0000-0000-0000-000000000004', 'Aguila', 'https://logo.clearbit.com/aguila.co', 'Cerveza oficial', 'https://aguila.co', 'd1b2c3d4-0000-0000-0000-000000000007'),
  ('a3b2c3d4-0000-0000-0000-000000000005', 'Alcaldía de Rionegro', 'https://logo.clearbit.com/rionegro.gov.co', 'Apoyo institucional', 'https://rionegro.gov.co', 'd1b2c3d4-0000-0000-0000-000000000007')
ON CONFLICT (id) DO NOTHING;

-- Evento 11: Hoy - Salta - Música (gratuito, folclore, con detalle completo)
INSERT INTO eventos (id, titulo, objetivo, publico_objetivo, descripcion_itinerario, fecha_inicio, fecha_fin, lugar_direccion, costo_entrada, es_gratuito, url_ticketera_externa, observaciones, ciudad_id, organizador_id) VALUES
  ('d1b2c3d4-0000-0000-0000-000000000011',
   'Festival de Folclore Salta',
   'Celebrar y preservar las tradiciones musicales del norte argentino',
   'Público general, turistas nacionales e internacionales',
   '10:00 Feria de artesanías\n11:00 Taller de danzas folclóricas\n14:00 Almuerzo típico (empanadas y locro)\n16:00 Actuación de ballets folclóricos\n18:00 Artista principal: Los Cantores del Valle\n20:00 Peña folclórica con baile popular\n23:00 Cierre con fuegos artificiales',
   CURRENT_DATE + TIME '10:00:00',
   CURRENT_DATE + TIME '23:00:00',
   'Plaza 9 de Julio, Salta Capital',
   0, true, NULL,
   'Evento gratuito. Llevar reposera. Habrá puestos de comida y bebida.',
   'a1b2c3d4-0000-0000-0000-000000000007',
   'c1b2c3d4-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Evento 12: Hoy - Salta - Gastronomía (pago, cata de vinos)
INSERT INTO eventos (id, titulo, objetivo, publico_objetivo, descripcion_itinerario, fecha_inicio, fecha_fin, lugar_direccion, costo_entrada, es_gratuito, url_ticketera_externa, observaciones, ciudad_id, organizador_id) VALUES
  ('d1b2c3d4-0000-0000-0000-000000000012',
   'Experiencia Vinos de Altura Salta',
   'Degustar los mejores vinos de los valles salteños con maridaje regional',
   'Turistas enófilos, parejas y grupos de amigos',
   '15:00 Recepción con espumante\n15:30 Recorrido guiado por bodega\n17:00 Cata de 5 vinos de altura\n18:30 Maridaje con quesos y embutidos regionales\n20:00 Cena de tres pasos con vino incluido\n22:00 Cierre',
   CURRENT_DATE + TIME '15:00:00',
   CURRENT_DATE + TIME '22:00:00',
   'Bodega Colomé, Ruta 53 km 20, Valles Calchaquíes',
   95000, false, 'https://ticketera.com/vinos-altura-salta',
   'Incluye copa de cristal de regalo. No incluye transporte desde Salta capital.',
   'a1b2c3d4-0000-0000-0000-000000000007',
   'c1b2c3d4-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Evento 13: En 5 días - Salta - Deportes (aventura)
INSERT INTO eventos (id, titulo, objetivo, publico_objetivo, descripcion_itinerario, fecha_inicio, fecha_fin, lugar_direccion, costo_entrada, es_gratuito, url_ticketera_externa, observaciones, ciudad_id, organizador_id) VALUES
  ('d1b2c3d4-0000-0000-0000-000000000013',
   'Rafting Extremo en el Río Juramento',
   'Vivir una experiencia de adrenalina en los rápidos del norte argentino',
   'Jóvenes y adultos aventureros, grupos de amigos',
   '08:00 Encuentro en base\n08:30 Charla de seguridad y entrega de equipos\n09:00 Inicio de descenso (nivel III-IV)\n11:00 Parada en playa para refrigerio\n11:30 Continuación del descenso\n13:00 Llegada y almuerzo\n14:30 Fotos y devolución de equipos\n15:00 Fin de la actividad',
   CURRENT_DATE + INTERVAL '5 days' + TIME '08:00:00',
   CURRENT_DATE + INTERVAL '5 days' + TIME '15:00:00',
   'Río Juramento, Km 45 Ruta Nacional 9, Cafayate',
   120000, false, 'https://ticketera.com/rafting-salta',
   'Incluye equipo completo (chaleco, casco, remo), guía certificado y refrigerio. Edad mínima: 14 años.',
   'a1b2c3d4-0000-0000-0000-000000000007',
   'c1b2c3d4-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Evento 14: En 20 días - Salta - Arte (cultural)
INSERT INTO eventos (id, titulo, objetivo, publico_objetivo, descripcion_itinerario, fecha_inicio, fecha_fin, lugar_direccion, costo_entrada, es_gratuito, url_ticketera_externa, observaciones, ciudad_id, organizador_id) VALUES
  ('d1b2c3d4-0000-0000-0000-000000000014',
   'Muestra de Arte Sacro Salteño',
   'Exponer el patrimonio artístico religioso de las iglesias y conventos de Salta',
   'Amantes del arte, la historia y la arquitectura religiosa',
   '09:00 Apertura de la muestra\n10:00 Visita guiada: Escultura virreinal\n12:00 Pausa para almuerzo\n14:00 Conferencia: El barroco salteño\n16:00 Recorrido por iglesias históricas del centro\n18:00 Cierre con concierto de música barroca',
   CURRENT_DATE + INTERVAL '20 days' + TIME '09:00:00',
   CURRENT_DATE + INTERVAL '20 days' + TIME '19:00:00',
   'Museo Histórico del Norte, Casco Histórico de Salta',
   15000, false, 'https://ticketera.com/arte-sacro-salta',
   'Entrada incluye guía y materiales informativos. Fotografía permitida sin flash.',
   'a1b2c3d4-0000-0000-0000-000000000007',
   'c1b2c3d4-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Actividades del Festival de Folclore Salta
INSERT INTO actividades (id, nombre, descripcion, hora_inicio, hora_fin, evento_id) VALUES
  ('e1b2c3d4-0000-0000-0000-000000000011', 'Feria de artesanías', 'Exposición y venta de artesanías regionales', '10:00', '20:00', 'd1b2c3d4-0000-0000-0000-000000000011'),
  ('e1b2c3d4-0000-0000-0000-000000000012', 'Taller de danzas folclóricas', 'Clase abierta de chacarera y zamba', '11:00', '12:30', 'd1b2c3d4-0000-0000-0000-000000000011'),
  ('e1b2c3d4-0000-0000-0000-000000000013', 'Actuación de ballets folclóricos', 'Presentación de ballets de toda la provincia', '16:00', '17:30', 'd1b2c3d4-0000-0000-0000-000000000011'),
  ('e1b2c3d4-0000-0000-0000-000000000014', 'Los Cantores del Valle', 'Actuación estelar del reconocido grupo folclórico', '18:00', '20:00', 'd1b2c3d4-0000-0000-0000-000000000011'),
  ('e1b2c3d4-0000-0000-0000-000000000015', 'Peña folclórica', 'Baile popular abierto al público con música en vivo', '20:00', '23:00', 'd1b2c3d4-0000-0000-0000-000000000011')
ON CONFLICT (id) DO NOTHING;

-- Media del Festival de Folclore Salta
INSERT INTO media (id, url_archivo, tipo, evento_id) VALUES
  ('f1b2c3d4-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800', 'IMAGEN', 'd1b2c3d4-0000-0000-0000-000000000011'),
  ('f1b2c3d4-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800', 'IMAGEN', 'd1b2c3d4-0000-0000-0000-000000000011'),
  ('f1b2c3d4-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800', 'IMAGEN', 'd1b2c3d4-0000-0000-0000-000000000011'),
  ('f1b2c3d4-0000-0000-0000-000000000011', 'https://www.youtube.com/embed/6BUb6o8A_tA', 'VIDEO_EMBEDDED', 'd1b2c3d4-0000-0000-0000-000000000011')
ON CONFLICT (id) DO NOTHING;

-- Participantes del Festival de Folclore Salta
INSERT INTO participantes (id, nombre, rol_o_perfil, evento_id) VALUES
  ('a2b2c3d4-0000-0000-0000-000000000008', 'Martina Torres', 'Coordinadora General del Festival', 'd1b2c3d4-0000-0000-0000-000000000011'),
  ('a2b2c3d4-0000-0000-0000-000000000009', 'Hermanos Díaz', 'Ballet Folclórico Oficial', 'd1b2c3d4-0000-0000-0000-000000000011'),
  ('a2b2c3d4-0000-0000-0000-000000000010', 'Los Cantores del Valle', 'Grupo Musical Estelar', 'd1b2c3d4-0000-0000-0000-000000000011'),
  ('a2b2c3d4-0000-0000-0000-000000000011', 'Prof. Juan Mendoza', 'Tallerista de Danzas', 'd1b2c3d4-0000-0000-0000-000000000011')
ON CONFLICT (id) DO NOTHING;

-- Patrocinadores del Festival de Folclore Salta
INSERT INTO patrocinadores (id, nombre, logo_url, descripcion, sitio_web, evento_id) VALUES
  ('a3b2c3d4-0000-0000-0000-000000000006', 'Gobierno de Salta', 'https://logo.clearbit.com/salta.gob.ar', 'Apoyo gubernamental', 'https://salta.gob.ar', 'd1b2c3d4-0000-0000-0000-000000000011'),
  ('a3b2c3d4-0000-0000-0000-000000000007', 'Cerveza Salta', 'https://logo.clearbit.com/cervezasalta.com.ar', 'Cerveza oficial', 'https://cervezasalta.com.ar', 'd1b2c3d4-0000-0000-0000-000000000011'),
  ('a3b2c3d4-0000-0000-0000-000000000008', 'Hotel Sheraton Salta', 'https://logo.clearbit.com/sheraton.com.ar', 'Hospedaje oficial', 'https://sheraton.com.ar', 'd1b2c3d4-0000-0000-0000-000000000011')
ON CONFLICT (id) DO NOTHING;

-- Evento 6: Hoy - Bogotá - Tecnología (para tener múltiples eventos en una ciudad)
INSERT INTO eventos (id, titulo, objetivo, publico_objetivo, descripcion_itinerario, fecha_inicio, fecha_fin, lugar_direccion, costo_entrada, es_gratuito, url_ticketera_externa, observaciones, ciudad_id, organizador_id) VALUES
  ('d1b2c3d4-0000-0000-0000-000000000006',
   'Taller de Inteligencia Artificial Aplicada',
   'Capacitar a profesionales en el uso práctico de herramientas de IA',
   'Profesionales de tecnología, estudiantes y emprendedores',
   '08:00 Registro\n08:30 Fundamentos de IA\n10:30 Taller práctico con Python\n12:00 Almuerzo\n13:30 Casos de uso empresarial\n15:00 Hackathon por equipos\n17:00 Premiación y cierre',
   CURRENT_DATE + TIME '08:00:00',
   CURRENT_DATE + TIME '17:00:00',
   'Cámara de Comercio de Bogotá, Salón 301',
   120000, false, 'https://ticketera.com/taller-ia-bog',
   'Traer computador portátil. Se requiere conocimiento básico de Python.',
   'a1b2c3d4-0000-0000-0000-000000000001',
   'c1b2c3d4-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Relación Evento ↔ Interés
-- ============================================================
INSERT INTO evento_interes (evento_id, interes_id) VALUES
  ('d1b2c3d4-0000-0000-0000-000000000001', 'b1b2c3d4-0000-0000-0000-000000000001'), -- Jazz → Música
  ('d1b2c3d4-0000-0000-0000-000000000002', 'b1b2c3d4-0000-0000-0000-000000000002'), -- Meetup Web → Tecnología
  ('d1b2c3d4-0000-0000-0000-000000000003', 'b1b2c3d4-0000-0000-0000-000000000003'), -- Arte Caribe → Arte
  ('d1b2c3d4-0000-0000-0000-000000000004', 'b1b2c3d4-0000-0000-0000-000000000003'), -- Feria Cali → Arte
  ('d1b2c3d4-0000-0000-0000-000000000004', 'b1b2c3d4-0000-0000-0000-000000000004'), -- Feria Cali → Gastronomía
  ('d1b2c3d4-0000-0000-0000-000000000005', 'b1b2c3d4-0000-0000-0000-000000000005'), -- Maratón → Deportes
  ('d1b2c3d4-0000-0000-0000-000000000006', 'b1b2c3d4-0000-0000-0000-000000000002'), -- Taller IA → Tecnología
  ('d1b2c3d4-0000-0000-0000-000000000007', 'b1b2c3d4-0000-0000-0000-000000000001'), -- Rionegro Music → Música
  ('d1b2c3d4-0000-0000-0000-000000000008', 'b1b2c3d4-0000-0000-0000-000000000004'), -- Mercado Campesino → Gastronomía
  ('d1b2c3d4-0000-0000-0000-000000000009', 'b1b2c3d4-0000-0000-0000-000000000005'), -- Travesía Ecológica → Deportes
  ('d1b2c3d4-0000-0000-0000-000000000010', 'b1b2c3d4-0000-0000-0000-000000000002'), -- Congreso Tecnología → Tecnología
  ('d1b2c3d4-0000-0000-0000-000000000011', 'b1b2c3d4-0000-0000-0000-000000000001'), -- Folclore Salta → Música
  ('d1b2c3d4-0000-0000-0000-000000000012', 'b1b2c3d4-0000-0000-0000-000000000004'), -- Vinos Altura → Gastronomía
  ('d1b2c3d4-0000-0000-0000-000000000013', 'b1b2c3d4-0000-0000-0000-000000000005'), -- Rafting → Deportes
  ('d1b2c3d4-0000-0000-0000-000000000014', 'b1b2c3d4-0000-0000-0000-000000000003')  -- Arte Sacro → Arte
ON CONFLICT DO NOTHING;

-- ============================================================
-- Actividades (solo para el Festival de Jazz, evento con detalle completo)
-- ============================================================
INSERT INTO actividades (id, nombre, descripcion, hora_inicio, hora_fin, evento_id) VALUES
  ('e1b2c3d4-0000-0000-0000-000000000001', 'Apertura de puertas', 'Registro y bienvenida a los asistentes', '10:00', '11:00', 'd1b2c3d4-0000-0000-0000-000000000001'),
  ('e1b2c3d4-0000-0000-0000-000000000002', 'Banda de apertura: Jazz Fusión', 'Presentación de la banda local Jazz Fusión', '11:00', '12:30', 'd1b2c3d4-0000-0000-0000-000000000001'),
  ('e1b2c3d4-0000-0000-0000-000000000003', 'Taller de improvisación', 'Taller práctico de técnicas de improvisación en jazz', '13:00', '14:30', 'd1b2c3d4-0000-0000-0000-000000000001'),
  ('e1b2c3d4-0000-0000-0000-000000000004', 'Sexteto de Jazz: Artista principal', 'Presentación estelar del Sexteto de Jazz Internacional', '15:00', '17:00', 'd1b2c3d4-0000-0000-0000-000000000001'),
  ('e1b2c3d4-0000-0000-0000-000000000005', 'Jam session abierta', 'Espacio abierto para que músicos asistentes improvisen', '17:00', '19:00', 'd1b2c3d4-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Media (imágenes y video para el Festival de Jazz)
-- ============================================================
INSERT INTO media (id, url_archivo, tipo, evento_id) VALUES
  ('f1b2c3d4-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800', 'IMAGEN', 'd1b2c3d4-0000-0000-0000-000000000001'),
  ('f1b2c3d4-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800', 'IMAGEN', 'd1b2c3d4-0000-0000-0000-000000000001'),
  ('f1b2c3d4-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=800', 'IMAGEN', 'd1b2c3d4-0000-0000-0000-000000000001'),
  ('f1b2c3d4-0000-0000-0000-000000000004', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'VIDEO_EMBEDDED', 'd1b2c3d4-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Participantes del Festival de Jazz
-- ============================================================
INSERT INTO participantes (id, nombre, rol_o_perfil, evento_id) VALUES
  ('a2b2c3d4-0000-0000-0000-000000000001', 'María López', 'Directora Musical', 'd1b2c3d4-0000-0000-0000-000000000001'),
  ('a2b2c3d4-0000-0000-0000-000000000002', 'Juan Pérez', 'Saxofonista Principal', 'd1b2c3d4-0000-0000-0000-000000000001'),
  ('a2b2c3d4-0000-0000-0000-000000000003', 'Ana Martínez', 'Tallerista de Improvisación', 'd1b2c3d4-0000-0000-0000-000000000001'),
  ('a2b2c3d4-0000-0000-0000-000000000004', 'Pedro Ramírez', 'Baterista Invitado', 'd1b2c3d4-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Patrocinadores del Festival de Jazz
-- ============================================================
INSERT INTO patrocinadores (id, nombre, logo_url, descripcion, sitio_web, evento_id) VALUES
  ('a3b2c3d4-0000-0000-0000-000000000001', 'Bavaria', 'https://logo.clearbit.com/bavaria.co', 'Cerveza oficial', 'https://bavaria.co', 'd1b2c3d4-0000-0000-0000-000000000001'),
  ('a3b2c3d4-0000-0000-0000-000000000002', 'Claro Colombia', 'https://logo.clearbit.com/claro.com.co', 'Telecomunicaciones', 'https://claro.com.co', 'd1b2c3d4-0000-0000-0000-000000000001'),
  ('a3b2c3d4-0000-0000-0000-000000000003', 'IDARTES', 'https://logo.clearbit.com/idartes.gov.co', 'Instituto Distrital de las Artes', 'https://idartes.gov.co', 'd1b2c3d4-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Alianzas del Festival de Jazz
-- ============================================================
INSERT INTO alianzas (id, nombre_institucion, tipo_convenio, evento_id) VALUES
  ('a4b2c3d4-0000-0000-0000-000000000001', 'Alcaldía de Bogotá', 'Apoyo institucional', 'd1b2c3d4-0000-0000-0000-000000000001'),
  ('a4b2c3d4-0000-0000-0000-000000000002', 'Universidad Nacional', 'Práctica académica', 'd1b2c3d4-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;
