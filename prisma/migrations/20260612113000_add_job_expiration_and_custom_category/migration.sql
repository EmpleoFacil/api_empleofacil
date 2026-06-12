ALTER TABLE "Job"
ADD COLUMN "customCategory" TEXT,
ADD COLUMN "expiresAt" TIMESTAMP(3);

CREATE INDEX "Job_expiresAt_idx" ON "Job"("expiresAt");

INSERT INTO "JobCategory" ("id", "name", "icon", "isActive")
VALUES
  ('administration', 'Administracion', 'clipboard', true),
  ('agriculture', 'Agricultura', 'leaf', true),
  ('cashier', 'Caja', 'wallet', true),
  ('cleaning', 'Limpieza', 'broom', true),
  ('construction', 'Construccion', 'hammer', true),
  ('customer_service', 'Atencion al cliente', 'headset', true),
  ('design', 'Diseno y creatividad', 'palette', true),
  ('education', 'Educacion', 'graduation-cap', true),
  ('finance', 'Finanzas y contabilidad', 'calculator', true),
  ('health', 'Salud', 'stethoscope', true),
  ('hospitality', 'Hoteleria y turismo', 'hotel', true),
  ('human_resources', 'Recursos humanos', 'users', true),
  ('janitor', 'Conserjeria', 'keys', true),
  ('logistics', 'Logistica y distribucion', 'truck', true),
  ('maintenance', 'Mantenimiento', 'wrench', true),
  ('manufacturing', 'Produccion y manufactura', 'factory', true),
  ('marketing', 'Marketing', 'megaphone', true),
  ('restaurants', 'Restaurantes y cocina', 'utensils-crossed', true),
  ('sales', 'Ventas', 'badge-dollar-sign', true),
  ('security', 'Seguridad', 'shield', true),
  ('technology', 'Tecnologia', 'laptop', true),
  ('transport', 'Transporte', 'bus', true),
  ('warehouse', 'Bodega', 'box', true)
ON CONFLICT ("id") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "icon" = EXCLUDED."icon",
  "isActive" = EXCLUDED."isActive";
