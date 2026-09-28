ALTER TABLE "CandidateProfile"
  ADD COLUMN "age" INTEGER,
  ADD COLUMN "department" TEXT,
  ADD COLUMN "neighborhood" TEXT;

ALTER TABLE "JobCategory"
  ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

CREATE TABLE "JobSpecialty" (
  "id" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "JobSpecialty_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CandidateJobPreference" (
  "candidateId" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CandidateJobPreference_pkey" PRIMARY KEY ("candidateId", "categoryId")
);

CREATE TABLE "CandidateJobPreferenceSpecialty" (
  "candidateId" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "specialtyId" TEXT NOT NULL,
  CONSTRAINT "CandidateJobPreferenceSpecialty_pkey" PRIMARY KEY ("candidateId", "categoryId", "specialtyId")
);

CREATE TABLE "JobSpecialtySelection" (
  "jobId" TEXT NOT NULL,
  "specialtyId" TEXT NOT NULL,
  CONSTRAINT "JobSpecialtySelection_pkey" PRIMARY KEY ("jobId", "specialtyId")
);

CREATE INDEX "JobSpecialty_categoryId_isActive_sortOrder_idx"
  ON "JobSpecialty"("categoryId", "isActive", "sortOrder");
CREATE INDEX "CandidateJobPreference_categoryId_idx"
  ON "CandidateJobPreference"("categoryId");
CREATE INDEX "CandidateJobPreferenceSpecialty_specialtyId_idx"
  ON "CandidateJobPreferenceSpecialty"("specialtyId");
CREATE INDEX "JobSpecialtySelection_specialtyId_idx"
  ON "JobSpecialtySelection"("specialtyId");

ALTER TABLE "JobSpecialty"
  ADD CONSTRAINT "JobSpecialty_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "JobCategory"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CandidateJobPreference"
  ADD CONSTRAINT "CandidateJobPreference_candidateId_fkey"
  FOREIGN KEY ("candidateId") REFERENCES "CandidateProfile"("id")
  ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "CandidateJobPreference_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "JobCategory"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CandidateJobPreferenceSpecialty"
  ADD CONSTRAINT "CandidateJobPreferenceSpecialty_candidateId_categoryId_fkey"
  FOREIGN KEY ("candidateId", "categoryId")
  REFERENCES "CandidateJobPreference"("candidateId", "categoryId")
  ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "CandidateJobPreferenceSpecialty_specialtyId_fkey"
  FOREIGN KEY ("specialtyId") REFERENCES "JobSpecialty"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "JobSpecialtySelection"
  ADD CONSTRAINT "JobSpecialtySelection_jobId_fkey"
  FOREIGN KEY ("jobId") REFERENCES "Job"("id")
  ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "JobSpecialtySelection_specialtyId_fkey"
  FOREIGN KEY ("specialtyId") REFERENCES "JobSpecialty"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "JobCategory" ("id", "name", "icon", "sortOrder", "isActive")
VALUES
  ('cleaning', 'Servicios del hogar', 'broom', 1, true),
  ('security', 'Seguridad', 'shield', 2, true),
  ('janitor', 'Servicios generales', 'keys', 3, true),
  ('warehouse', 'Logística y bodega', 'box', 4, true),
  ('customer_service', 'Atención al cliente y ventas', 'headset', 5, true),
  ('administration', 'Administración y oficina', 'clipboard', 6, true)
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "icon" = EXCLUDED."icon",
  "sortOrder" = EXCLUDED."sortOrder",
  "isActive" = EXCLUDED."isActive";

INSERT INTO "JobSpecialty" ("id", "categoryId", "name", "sortOrder", "isActive")
VALUES
  ('home_nanny', 'cleaning', 'Niñera', 1, true),
  ('home_assistant', 'cleaning', 'Asistente del hogar', 2, true),
  ('home_cleaning', 'cleaning', 'Limpieza', 3, true),
  ('home_gardening', 'cleaning', 'Jardinería', 4, true),
  ('home_painting', 'cleaning', 'Pintura', 5, true),
  ('home_cooking', 'cleaning', 'Cocina', 6, true),
  ('home_elder_care', 'cleaning', 'Cuido de adultos mayores', 7, true),
  ('home_laundry', 'cleaning', 'Lavandería y planchado', 8, true),
  ('home_plumbing', 'cleaning', 'Fontanería doméstica', 9, true),
  ('home_electrical', 'cleaning', 'Electricidad doméstica', 10, true),
  ('home_repairs', 'cleaning', 'Reparaciones del hogar', 11, true),
  ('security_guard', 'security', 'Guarda de seguridad', 1, true),
  ('security_cctv', 'security', 'Operador de CCTV', 2, true),
  ('security_access', 'security', 'Control de acceso', 3, true),
  ('security_patrol', 'security', 'Patrullaje', 4, true),
  ('security_supervisor', 'security', 'Supervisor de seguridad', 5, true),
  ('general_janitor', 'janitor', 'Conserjería', 1, true),
  ('general_maintenance', 'janitor', 'Mantenimiento general', 2, true),
  ('general_gardening', 'janitor', 'Jardinería de áreas comunes', 3, true),
  ('warehouse_assistant', 'warehouse', 'Auxiliar de bodega', 1, true),
  ('warehouse_inventory', 'warehouse', 'Control de inventario', 2, true),
  ('warehouse_loading', 'warehouse', 'Carga y descarga', 3, true),
  ('warehouse_forklift', 'warehouse', 'Operador de montacargas', 4, true),
  ('warehouse_shipping', 'warehouse', 'Recepción y despacho', 5, true),
  ('service_customer', 'customer_service', 'Atención al cliente', 1, true),
  ('service_call_center', 'customer_service', 'Call center', 2, true),
  ('service_cashier', 'customer_service', 'Caja y cobro', 3, true),
  ('service_sales', 'customer_service', 'Asesoría de ventas', 4, true),
  ('service_store', 'customer_service', 'Supervisión de tienda', 5, true),
  ('admin_assistant', 'administration', 'Asistente administrativo', 1, true),
  ('admin_reception', 'administration', 'Recepción', 2, true),
  ('admin_data_entry', 'administration', 'Digitación de datos', 3, true),
  ('admin_accounting', 'administration', 'Asistente contable', 4, true),
  ('admin_hr', 'administration', 'Asistente de recursos humanos', 5, true),
  ('admin_documents', 'administration', 'Gestión de documentos', 6, true)
ON CONFLICT ("id") DO UPDATE SET
  "categoryId" = EXCLUDED."categoryId",
  "name" = EXCLUDED."name",
  "sortOrder" = EXCLUDED."sortOrder",
  "isActive" = EXCLUDED."isActive";

INSERT INTO "JobSpecialtySelection" ("jobId", "specialtyId")
SELECT "id", 'home_cleaning'
FROM "Job"
WHERE "categoryId" = 'cleaning'
ON CONFLICT DO NOTHING;
