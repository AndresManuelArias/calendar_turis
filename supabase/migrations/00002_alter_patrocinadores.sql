ALTER TABLE patrocinadores
  RENAME COLUMN nombre_empresa TO nombre;

ALTER TABLE patrocinadores
  RENAME COLUMN url_logo TO logo_url;

ALTER TABLE patrocinadores
  DROP CONSTRAINT patrocinadores_nivel_patrocinio_check;

ALTER TABLE patrocinadores
  DROP COLUMN nivel_patrocinio;

ALTER TABLE patrocinadores
  ADD COLUMN descripcion TEXT;

ALTER TABLE patrocinadores
  ADD COLUMN sitio_web TEXT;
