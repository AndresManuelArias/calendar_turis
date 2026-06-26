-- Seed: Datos iniciales para desarrollo de Agenda Lugar

-- ============================================================
-- Ciudades
-- ============================================================
INSERT INTO ciudades (id, nombre, codigo_region) VALUES
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Bogotá', 'DC'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'Medellín', 'ANT'),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'Cali', 'VAC'),
  ('a1b2c3d4-0000-0000-0000-000000000004', 'Barranquilla', 'ATL'),
  ('a1b2c3d4-0000-0000-0000-000000000005', 'Cartagena', 'BOL')
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
