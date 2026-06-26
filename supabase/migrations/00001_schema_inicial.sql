-- Migration: 00001_schema_inicial
-- Descripción: Schema inicial del proyecto Agenda Lugar

-- ============================================================
-- Tabla de ciudades
-- ============================================================
CREATE TABLE ciudades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  codigo_region TEXT NOT NULL,
  pais TEXT NOT NULL DEFAULT 'Colombia',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Tabla de usuarios
-- ============================================================
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  contrasenia_hash TEXT NOT NULL,
  fecha_registro TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Tabla de organizadores (hereda de usuarios)
-- ============================================================
CREATE TABLE organizadores (
  id UUID PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  nit_o_rut TEXT,
  telefono_contacto TEXT,
  sitio_web TEXT
);

-- ============================================================
-- Tabla de intereses/categorías
-- ============================================================
CREATE TABLE intereses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT
);

-- ============================================================
-- Tabla de eventos
-- ============================================================
CREATE TABLE eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  objetivo TEXT NOT NULL,
  publico_objetivo TEXT NOT NULL,
  descripcion_itinerario TEXT DEFAULT '',
  fecha_inicio TIMESTAMPTZ NOT NULL,
  fecha_fin TIMESTAMPTZ NOT NULL,
  lugar_direccion TEXT NOT NULL,
  costo_entrada DECIMAL(10,2) DEFAULT 0,
  es_gratuito BOOLEAN DEFAULT true,
  url_ticketera_externa TEXT,
  observaciones TEXT,
  ciudad_id UUID NOT NULL REFERENCES ciudades(id),
  organizador_id UUID NOT NULL REFERENCES organizadores(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Tabla de actividades
-- ============================================================
CREATE TABLE actividades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  evento_id UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE
);

-- ============================================================
-- Tabla de media (imágenes/videos embebidos)
-- ============================================================
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url_archivo TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('IMAGEN', 'VIDEO_EMBEDDED')),
  evento_id UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE
);

-- ============================================================
-- Tabla de participantes (conferencistas, DJs, talleristas)
-- ============================================================
CREATE TABLE participantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  rol_o_perfil TEXT NOT NULL,
  evento_id UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE
);

-- ============================================================
-- Tabla de patrocinadores
-- ============================================================
CREATE TABLE patrocinadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_empresa TEXT NOT NULL,
  url_logo TEXT,
  nivel_patrocinio TEXT NOT NULL CHECK (nivel_patrocinio IN ('Oro', 'Plata', 'Bronce')),
  evento_id UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE
);

-- ============================================================
-- Tabla de alianzas
-- ============================================================
CREATE TABLE alianzas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_institucion TEXT NOT NULL,
  tipo_convenio TEXT NOT NULL,
  evento_id UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE
);

-- ============================================================
-- Tabla de relación eventos <> intereses (N:M)
-- ============================================================
CREATE TABLE evento_interes (
  evento_id UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  interes_id UUID NOT NULL REFERENCES intereses(id) ON DELETE CASCADE,
  PRIMARY KEY (evento_id, interes_id)
);

-- ============================================================
-- Índices para mejorar rendimiento de consultas
-- ============================================================
CREATE INDEX idx_eventos_fecha_inicio ON eventos(fecha_inicio);
CREATE INDEX idx_eventos_ciudad_id ON eventos(ciudad_id);
CREATE INDEX idx_eventos_organizador_id ON eventos(organizador_id);
CREATE INDEX idx_actividades_evento_id ON actividades(evento_id);
CREATE INDEX idx_media_evento_id ON media(evento_id);
CREATE INDEX idx_participantes_evento_id ON participantes(evento_id);
CREATE INDEX idx_patrocinadores_evento_id ON patrocinadores(evento_id);
CREATE INDEX idx_alianzas_evento_id ON alianzas(evento_id);
CREATE INDEX idx_evento_interes_evento_id ON evento_interes(evento_id);
CREATE INDEX idx_evento_interes_interes_id ON evento_interes(interes_id);

-- ============================================================
-- Permisos para desarrollo (rol anon)
-- ============================================================
ALTER TABLE ciudades DISABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE organizadores DISABLE ROW LEVEL SECURITY;
ALTER TABLE intereses DISABLE ROW LEVEL SECURITY;
ALTER TABLE eventos DISABLE ROW LEVEL SECURITY;
ALTER TABLE actividades DISABLE ROW LEVEL SECURITY;
ALTER TABLE media DISABLE ROW LEVEL SECURITY;
ALTER TABLE participantes DISABLE ROW LEVEL SECURITY;
ALTER TABLE patrocinadores DISABLE ROW LEVEL SECURITY;
ALTER TABLE alianzas DISABLE ROW LEVEL SECURITY;
ALTER TABLE evento_interes DISABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT INSERT ON ALL TABLES IN SCHEMA public TO anon;
GRANT UPDATE ON ALL TABLES IN SCHEMA public TO anon;
