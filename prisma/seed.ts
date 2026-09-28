import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Limpiando base de datos...');
  
  // Limpiar en orden de dependencias
  await prisma.activityLog.deleteMany();
  await prisma.messageResponse.deleteMany();
  await prisma.message.deleteMany();
  await prisma.messageTemplate.deleteMany();
  await prisma.interviewResult.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.applicationNote.deleteMany();
  await prisma.application.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.candidateDocument.deleteMany();
  await prisma.jobSpecialtySelection.deleteMany();
  await prisma.candidateJobPreferenceSpecialty.deleteMany();
  await prisma.candidateJobPreference.deleteMany();
  await prisma.jobSpecialty.deleteMany();
  await prisma.job.deleteMany();
  await prisma.jobCategory.deleteMany();
  await prisma.documentType.deleteMany();
  await prisma.companyUser.deleteMany();
  await prisma.billingPayment.deleteMany();
  await prisma.billingSubscription.deleteMany();
  await prisma.company.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.platformSettings.deleteMany();
  await prisma.passwordRecovery.deleteMany();
  await prisma.candidateProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Demo1234', 10);

  console.log('📦 Creando planes...');
  
  const planBasic = await prisma.plan.create({
    data: {
      id: 'plan_basic',
      name: 'Básico',
      price: 1200,
      currency: 'NIO',
      publicationLimit: 10,
      userLimit: 3,
      visibleCandidatesLimit: 200,
    },
  });

  const planProfessional = await prisma.plan.create({
    data: {
      id: 'plan_professional',
      name: 'Profesional',
      price: 2500,
      currency: 'NIO',
      publicationLimit: 30,
      userLimit: 5,
      visibleCandidatesLimit: 500,
    },
  });

  const planEnterprise = await prisma.plan.create({
    data: {
      id: 'plan_enterprise',
      name: 'Empresarial',
      price: 4500,
      currency: 'NIO',
      publicationLimit: null, // ilimitado
      userLimit: null,
      visibleCandidatesLimit: null,
    },
  });

  console.log('📂 Creando categorías de trabajo...');
  
  await prisma.jobCategory.createMany({
    data: [
      { id: 'cleaning', name: 'Servicios del hogar', icon: 'broom', sortOrder: 1 },
      { id: 'janitor', name: 'Servicios generales', icon: 'keys', sortOrder: 2 },
      { id: 'customer_service', name: 'Atención al cliente y ventas', icon: 'headset', sortOrder: 3 },
      { id: 'hospitality_food', name: 'Restaurantes, hotelería y turismo', icon: 'restaurant', sortOrder: 4 },
      { id: 'health_care', name: 'Salud y cuidado', icon: 'medical', sortOrder: 5 },
      { id: 'personal_care', name: 'Belleza y cuidado personal', icon: 'beauty', sortOrder: 6 },
      { id: 'security', name: 'Seguridad', icon: 'shield', sortOrder: 7 },
      { id: 'warehouse', name: 'Logística y bodega', icon: 'box', sortOrder: 8 },
      { id: 'transport_delivery', name: 'Transporte y reparto', icon: 'truck', sortOrder: 9 },
      { id: 'manufacturing', name: 'Producción y manufactura', icon: 'factory', sortOrder: 10 },
      { id: 'agriculture_livestock', name: 'Agricultura y ganadería', icon: 'agriculture', sortOrder: 11 },
      { id: 'construction_trades', name: 'Construcción y oficios', icon: 'hard_hat', sortOrder: 12 },
      { id: 'automotive_service', name: 'Mecánica y servicio automotriz', icon: 'car', sortOrder: 13 },
      { id: 'technology_it', name: 'Tecnología y soporte', icon: 'laptop', sortOrder: 14 },
      { id: 'administration', name: 'Administración y oficina', icon: 'clipboard', sortOrder: 15 },
      { id: 'education_training', name: 'Educación y capacitación', icon: 'school', sortOrder: 16 },
    ],
  });

  await prisma.jobSpecialty.createMany({
    data: [
      { id: 'home_nanny', categoryId: 'cleaning', name: 'Niñera', sortOrder: 1 },
      { id: 'home_assistant', categoryId: 'cleaning', name: 'Asistente del hogar', sortOrder: 2 },
      { id: 'home_cleaning', categoryId: 'cleaning', name: 'Limpieza', sortOrder: 3 },
      { id: 'home_gardening', categoryId: 'cleaning', name: 'Jardinería', sortOrder: 4 },
      { id: 'home_painting', categoryId: 'cleaning', name: 'Pintura', sortOrder: 5 },
      { id: 'home_cooking', categoryId: 'cleaning', name: 'Cocina', sortOrder: 6 },
      { id: 'home_elder_care', categoryId: 'cleaning', name: 'Cuido de adultos mayores', sortOrder: 7 },
      { id: 'home_laundry', categoryId: 'cleaning', name: 'Lavandería y planchado', sortOrder: 8 },
      { id: 'home_plumbing', categoryId: 'cleaning', name: 'Fontanería doméstica', sortOrder: 9 },
      { id: 'home_electrical', categoryId: 'cleaning', name: 'Electricidad doméstica', sortOrder: 10 },
      { id: 'home_repairs', categoryId: 'cleaning', name: 'Reparaciones del hogar', sortOrder: 11 },
      { id: 'security_guard', categoryId: 'security', name: 'Guarda de seguridad', sortOrder: 1 },
      { id: 'security_cctv', categoryId: 'security', name: 'Operador de CCTV', sortOrder: 2 },
      { id: 'security_access', categoryId: 'security', name: 'Control de acceso', sortOrder: 3 },
      { id: 'security_patrol', categoryId: 'security', name: 'Patrullaje', sortOrder: 4 },
      { id: 'security_supervisor', categoryId: 'security', name: 'Supervisor de seguridad', sortOrder: 5 },
      { id: 'general_janitor', categoryId: 'janitor', name: 'Conserjería', sortOrder: 1 },
      { id: 'general_maintenance', categoryId: 'janitor', name: 'Mantenimiento general', sortOrder: 2 },
      { id: 'general_gardening', categoryId: 'janitor', name: 'Jardinería de áreas comunes', sortOrder: 3 },
      { id: 'warehouse_assistant', categoryId: 'warehouse', name: 'Auxiliar de bodega', sortOrder: 1 },
      { id: 'warehouse_inventory', categoryId: 'warehouse', name: 'Control de inventario', sortOrder: 2 },
      { id: 'warehouse_loading', categoryId: 'warehouse', name: 'Carga y descarga', sortOrder: 3 },
      { id: 'warehouse_forklift', categoryId: 'warehouse', name: 'Operador de montacargas', sortOrder: 4 },
      { id: 'warehouse_shipping', categoryId: 'warehouse', name: 'Recepción y despacho', sortOrder: 5 },
      { id: 'service_customer', categoryId: 'customer_service', name: 'Atención al cliente', sortOrder: 1 },
      { id: 'service_call_center', categoryId: 'customer_service', name: 'Call center', sortOrder: 2 },
      { id: 'service_cashier', categoryId: 'customer_service', name: 'Caja y cobro', sortOrder: 3 },
      { id: 'service_sales', categoryId: 'customer_service', name: 'Asesoría de ventas', sortOrder: 4 },
      { id: 'service_store', categoryId: 'customer_service', name: 'Supervisión de tienda', sortOrder: 5 },
      { id: 'admin_assistant', categoryId: 'administration', name: 'Asistente administrativo', sortOrder: 1 },
      { id: 'admin_reception', categoryId: 'administration', name: 'Recepción', sortOrder: 2 },
      { id: 'admin_data_entry', categoryId: 'administration', name: 'Digitación de datos', sortOrder: 3 },
      { id: 'admin_accounting', categoryId: 'administration', name: 'Asistente contable', sortOrder: 4 },
      { id: 'admin_hr', categoryId: 'administration', name: 'Asistente de recursos humanos', sortOrder: 5 },
      { id: 'admin_documents', categoryId: 'administration', name: 'Gestión de documentos', sortOrder: 6 },
      { id: 'hospitality_cook', categoryId: 'hospitality_food', name: 'Cocinero/a', sortOrder: 1 },
      { id: 'hospitality_kitchen_assistant', categoryId: 'hospitality_food', name: 'Ayudante de cocina', sortOrder: 2 },
      { id: 'hospitality_waiter', categoryId: 'hospitality_food', name: 'Mesero/a', sortOrder: 3 },
      { id: 'hospitality_barista', categoryId: 'hospitality_food', name: 'Barista', sortOrder: 4 },
      { id: 'hospitality_bartender', categoryId: 'hospitality_food', name: 'Bartender', sortOrder: 5 },
      { id: 'hospitality_dishwasher', categoryId: 'hospitality_food', name: 'Lavaplatos', sortOrder: 6 },
      { id: 'hospitality_hotel_reception', categoryId: 'hospitality_food', name: 'Recepcionista de hotel', sortOrder: 7 },
      { id: 'hospitality_room_attendant', categoryId: 'hospitality_food', name: 'Camarista y limpieza de habitaciones', sortOrder: 8 },
      { id: 'hospitality_tour_guide', categoryId: 'hospitality_food', name: 'Guía turístico/a', sortOrder: 9 },
      { id: 'health_nurse', categoryId: 'health_care', name: 'Enfermería', sortOrder: 1 },
      { id: 'health_nursing_assistant', categoryId: 'health_care', name: 'Auxiliar de enfermería', sortOrder: 2 },
      { id: 'health_clinical_assistant', categoryId: 'health_care', name: 'Asistente clínico', sortOrder: 3 },
      { id: 'health_dental_assistant', categoryId: 'health_care', name: 'Asistente dental', sortOrder: 4 },
      { id: 'health_pharmacy_assistant', categoryId: 'health_care', name: 'Auxiliar de farmacia', sortOrder: 5 },
      { id: 'health_clinic_reception', categoryId: 'health_care', name: 'Recepción de clínica', sortOrder: 6 },
      { id: 'health_lab_technician', categoryId: 'health_care', name: 'Técnico/a de laboratorio', sortOrder: 7 },
      { id: 'health_phlebotomy', categoryId: 'health_care', name: 'Toma de muestras', sortOrder: 8 },
      { id: 'personal_stylist', categoryId: 'personal_care', name: 'Estilista', sortOrder: 1 },
      { id: 'personal_barber', categoryId: 'personal_care', name: 'Barbería', sortOrder: 2 },
      { id: 'personal_nails', categoryId: 'personal_care', name: 'Manicure y pedicure', sortOrder: 3 },
      { id: 'personal_makeup', categoryId: 'personal_care', name: 'Maquillaje', sortOrder: 4 },
      { id: 'personal_cosmetology', categoryId: 'personal_care', name: 'Cosmetología', sortOrder: 5 },
      { id: 'personal_massage', categoryId: 'personal_care', name: 'Masajes', sortOrder: 6 },
      { id: 'personal_skin_care', categoryId: 'personal_care', name: 'Cuidado de la piel', sortOrder: 7 },
      { id: 'transport_delivery', categoryId: 'transport_delivery', name: 'Repartidor/a', sortOrder: 1 },
      { id: 'transport_motorcycle', categoryId: 'transport_delivery', name: 'Motorizado/a', sortOrder: 2 },
      { id: 'transport_private_driver', categoryId: 'transport_delivery', name: 'Chofer particular', sortOrder: 3 },
      { id: 'transport_taxi', categoryId: 'transport_delivery', name: 'Taxista', sortOrder: 4 },
      { id: 'transport_bus', categoryId: 'transport_delivery', name: 'Conductor/a de autobús', sortOrder: 5 },
      { id: 'transport_truck', categoryId: 'transport_delivery', name: 'Conductor/a de camión', sortOrder: 6 },
      { id: 'transport_courier', categoryId: 'transport_delivery', name: 'Mensajería', sortOrder: 7 },
      { id: 'transport_dispatch', categoryId: 'transport_delivery', name: 'Despacho y rutas', sortOrder: 8 },
      { id: 'production_line', categoryId: 'manufacturing', name: 'Operario/a de producción', sortOrder: 1 },
      { id: 'production_packaging', categoryId: 'manufacturing', name: 'Empaque y etiquetado', sortOrder: 2 },
      { id: 'production_machine', categoryId: 'manufacturing', name: 'Operador/a de maquinaria', sortOrder: 3 },
      { id: 'production_assembly', categoryId: 'manufacturing', name: 'Ensamblaje', sortOrder: 4 },
      { id: 'production_quality_control', categoryId: 'manufacturing', name: 'Control de calidad', sortOrder: 5 },
      { id: 'production_sewing', categoryId: 'manufacturing', name: 'Costura y confección', sortOrder: 6 },
      { id: 'production_food_processing', categoryId: 'manufacturing', name: 'Procesamiento de alimentos', sortOrder: 7 },
      { id: 'production_supervisor', categoryId: 'manufacturing', name: 'Supervisión de línea', sortOrder: 8 },
      { id: 'agriculture_crop_worker', categoryId: 'agriculture_livestock', name: 'Siembra y cultivo', sortOrder: 1 },
      { id: 'agriculture_coffee_harvest', categoryId: 'agriculture_livestock', name: 'Corte de café y cosecha', sortOrder: 2 },
      { id: 'agriculture_livestock_care', categoryId: 'agriculture_livestock', name: 'Manejo de ganado', sortOrder: 3 },
      { id: 'agriculture_milking', categoryId: 'agriculture_livestock', name: 'Ordeño', sortOrder: 4 },
      { id: 'agriculture_poultry', categoryId: 'agriculture_livestock', name: 'Avicultura', sortOrder: 5 },
      { id: 'agriculture_irrigation', categoryId: 'agriculture_livestock', name: 'Riego de cultivos', sortOrder: 6 },
      { id: 'agriculture_machinery', categoryId: 'agriculture_livestock', name: 'Maquinaria agrícola', sortOrder: 7 },
      { id: 'agriculture_greenhouse', categoryId: 'agriculture_livestock', name: 'Viveros e invernaderos', sortOrder: 8 },
      { id: 'construction_helper', categoryId: 'construction_trades', name: 'Ayudante de construcción', sortOrder: 1 },
      { id: 'construction_masonry', categoryId: 'construction_trades', name: 'Albañilería', sortOrder: 2 },
      { id: 'construction_carpentry', categoryId: 'construction_trades', name: 'Carpintería', sortOrder: 3 },
      { id: 'construction_plumbing', categoryId: 'construction_trades', name: 'Fontanería', sortOrder: 4 },
      { id: 'construction_electrical', categoryId: 'construction_trades', name: 'Electricidad', sortOrder: 5 },
      { id: 'construction_welding', categoryId: 'construction_trades', name: 'Soldadura', sortOrder: 6 },
      { id: 'construction_painting', categoryId: 'construction_trades', name: 'Pintura', sortOrder: 7 },
      { id: 'construction_drywall', categoryId: 'construction_trades', name: 'Gypsum y tabla roca', sortOrder: 8 },
      { id: 'construction_tiling', categoryId: 'construction_trades', name: 'Cerámica y acabados', sortOrder: 9 },
      { id: 'construction_roofing', categoryId: 'construction_trades', name: 'Techado y cubiertas', sortOrder: 10 },
      { id: 'auto_mechanic', categoryId: 'automotive_service', name: 'Mecánica automotriz', sortOrder: 1 },
      { id: 'auto_motorcycle_mechanic', categoryId: 'automotive_service', name: 'Mecánica de motocicletas', sortOrder: 2 },
      { id: 'auto_tire_service', categoryId: 'automotive_service', name: 'Llantería', sortOrder: 3 },
      { id: 'auto_electrical', categoryId: 'automotive_service', name: 'Electricidad automotriz', sortOrder: 4 },
      { id: 'auto_bodywork', categoryId: 'automotive_service', name: 'Enderezado y pintura', sortOrder: 5 },
      { id: 'auto_oil_change', categoryId: 'automotive_service', name: 'Cambio de aceite y lubricación', sortOrder: 6 },
      { id: 'auto_diagnostics', categoryId: 'automotive_service', name: 'Diagnóstico automotriz', sortOrder: 7 },
      { id: 'tech_support', categoryId: 'technology_it', name: 'Soporte técnico', sortOrder: 1 },
      { id: 'tech_computer_repair', categoryId: 'technology_it', name: 'Reparación de computadoras', sortOrder: 2 },
      { id: 'tech_networks', categoryId: 'technology_it', name: 'Redes y conectividad', sortOrder: 3 },
      { id: 'tech_systems_admin', categoryId: 'technology_it', name: 'Administración de sistemas', sortOrder: 4 },
      { id: 'tech_web_development', categoryId: 'technology_it', name: 'Desarrollo web', sortOrder: 5 },
      { id: 'tech_software_development', categoryId: 'technology_it', name: 'Desarrollo de software', sortOrder: 6 },
      { id: 'tech_data_analysis', categoryId: 'technology_it', name: 'Análisis de datos', sortOrder: 7 },
      { id: 'tech_cybersecurity', categoryId: 'technology_it', name: 'Ciberseguridad', sortOrder: 8 },
      { id: 'education_preschool', categoryId: 'education_training', name: 'Docencia preescolar', sortOrder: 1 },
      { id: 'education_primary', categoryId: 'education_training', name: 'Docencia primaria', sortOrder: 2 },
      { id: 'education_secondary', categoryId: 'education_training', name: 'Docencia secundaria', sortOrder: 3 },
      { id: 'education_classroom_assistant', categoryId: 'education_training', name: 'Asistente de aula', sortOrder: 4 },
      { id: 'education_tutoring', categoryId: 'education_training', name: 'Tutorías', sortOrder: 5 },
      { id: 'education_language_instructor', categoryId: 'education_training', name: 'Enseñanza de idiomas', sortOrder: 6 },
      { id: 'education_vocational_instructor', categoryId: 'education_training', name: 'Instructor/a técnico/a', sortOrder: 7 },
    ],
  });

  console.log('📄 Creando tipos de documentos...');
  
  await prisma.documentType.createMany({
    data: [
      { id: 'id_front', label: 'Cédula (frente)', isRequired: true },
      { id: 'id_back', label: 'Cédula (reverso)', isRequired: true },
      { id: 'cv', label: 'Currículum Vitae', isRequired: true },
      { id: 'police_record', label: 'Récord policial', isRequired: false },
    ],
  });

  console.log('👤 Creando usuarios...');

  // Super Admin (credenciales de prueba)
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10);
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@empleofacil.com',
      passwordHash: adminPasswordHash,
      role: 'super_admin',
      status: 'active',
    },
  });

  // Super Admin original (mantener para compatibilidad)
  await prisma.user.create({
    data: {
      email: 'superadmin@empleo.com.ni',
      passwordHash,
      role: 'super_admin',
      status: 'active',
    },
  });

  // Company Admin - Segurimax
  const companyAdminSegurimax = await prisma.user.create({
    data: {
      email: 'carlos.mendoza@segurimax.com.ni',
      passwordHash,
      role: 'company_admin',
      status: 'active',
    },
  });

  // Company Recruiter - Segurimax
  const companyRecruiterSegurimax = await prisma.user.create({
    data: {
      email: 'maria.perez@segurimax.com.ni',
      passwordHash,
      role: 'company_recruiter',
      status: 'active',
    },
  });

  // Candidatos
  const candidateCarlos = await prisma.user.create({
    data: {
      phone: '+50588888888',
      passwordHash,
      role: 'candidate',
      status: 'active',
      candidateProfile: {
        create: {
          fullName: 'Carlos Mendoza',
          city: 'Managua',
          country: 'Nicaragua',
          phone: '+50588888888',
          desiredJobType: 'security',
          availability: 'immediate',
          salaryExpectationMin: 12000,
          salaryExpectationMax: 16000,
          profileCompletion: 85,
        },
      },
    },
    include: { candidateProfile: true },
  });

  const candidateMaria = await prisma.user.create({
    data: {
      phone: '+50588888889',
      passwordHash,
      role: 'candidate',
      status: 'active',
      candidateProfile: {
        create: {
          fullName: 'María José Pérez',
          city: 'Managua',
          country: 'Nicaragua',
          phone: '+50588888889',
          desiredJobType: 'security',
          availability: 'immediate',
          salaryExpectationMin: 12000,
          salaryExpectationMax: 18000,
          profileCompletion: 100,
        },
      },
    },
    include: { candidateProfile: true },
  });

  const candidateAndres = await prisma.user.create({
    data: {
      phone: '+50588888890',
      passwordHash,
      role: 'candidate',
      status: 'active',
      candidateProfile: {
        create: {
          fullName: 'Andrés López',
          city: 'Masaya',
          country: 'Nicaragua',
          phone: '+50588888890',
          desiredJobType: 'warehouse',
          availability: '15_days',
          salaryExpectationMin: 11000,
          salaryExpectationMax: 14000,
          profileCompletion: 100,
        },
      },
    },
    include: { candidateProfile: true },
  });

  const candidateValeria = await prisma.user.create({
    data: {
      phone: '+50588888891',
      passwordHash,
      role: 'candidate',
      status: 'active',
      candidateProfile: {
        create: {
          fullName: 'Valeria Martínez',
          city: 'León',
          country: 'Nicaragua',
          phone: '+50588888891',
          desiredJobType: 'cleaning',
          availability: 'immediate',
          salaryExpectationMin: 9500,
          salaryExpectationMax: 12000,
          profileCompletion: 100,
        },
      },
    },
    include: { candidateProfile: true },
  });

  console.log('🏢 Creando empresas...');

  // Empresa de prueba
  const empresaTest = await prisma.company.create({
    data: {
      name: 'Empresa Test',
      slug: 'empresa-test',
      legalName: 'Empresa Test S.A.',
      email: 'contacto@empresatest.com',
      phone: '+50522222221',
      city: 'Managua',
      country: 'Nicaragua',
      planId: planProfessional.id,
      status: 'active',
    },
  });

  const segurimax = await prisma.company.create({
    data: {
      name: 'Segurimax S.A.',
      slug: 'segurimax',
      legalName: 'Segurimax Sociedad Anónima',
      email: 'contacto@segurimax.com.ni',
      phone: '+50522222222',
      city: 'Managua',
      country: 'Nicaragua',
      planId: planProfessional.id,
      status: 'active',
    },
  });

  const limpioMas = await prisma.company.create({
    data: {
      name: 'Limpio Más S.A.',
      slug: 'limpio-mas',
      email: 'contacto@limpiomas.com.ni',
      phone: '+50522222223',
      city: 'Masaya',
      country: 'Nicaragua',
      planId: planBasic.id,
      status: 'active',
    },
  });

  const comercialOrtega = await prisma.company.create({
    data: {
      name: 'Comercial Ortega',
      slug: 'comercial-ortega',
      email: 'contacto@comercialortega.com.ni',
      phone: '+50522222224',
      city: 'Managua',
      country: 'Nicaragua',
      planId: planBasic.id,
      status: 'active',
    },
  });

  const bodegasNorte = await prisma.company.create({
    data: {
      name: 'Bodegas del Norte',
      slug: 'bodegas-norte',
      email: 'contacto@bodegasnorte.com.ni',
      phone: '+50522222225',
      city: 'Estelí',
      country: 'Nicaragua',
      planId: planEnterprise.id,
      status: 'active',
    },
  });

  console.log('👥 Asignando usuarios a empresas...');

  // Usuario empresa de prueba
  const empresaPasswordHash = await bcrypt.hash('Empresa123!', 10);
  const empresaTestUser = await prisma.user.create({
    data: {
      email: 'empresa@test.com',
      passwordHash: empresaPasswordHash,
      role: 'company_admin',
      status: 'active',
    },
  });

  await prisma.companyUser.create({
    data: {
      companyId: empresaTest.id,
      userId: empresaTestUser.id,
      role: 'admin',
    },
  });

  await prisma.companyUser.create({
    data: {
      companyId: segurimax.id,
      userId: companyAdminSegurimax.id,
      role: 'admin',
    },
  });

  await prisma.companyUser.create({
    data: {
      companyId: segurimax.id,
      userId: companyRecruiterSegurimax.id,
      role: 'recruiter',
    },
  });

  console.log('💼 Creando vacantes...');

  const jobGuardia = await prisma.job.create({
    data: {
      companyId: segurimax.id,
      categoryId: 'security',
      title: 'Guardia de seguridad',
      description: 'Buscamos guardia de seguridad para turno nocturno en edificio corporativo.',
      requirements: ['Experiencia mínima 1 año', 'Récord policial limpio', 'Disponibilidad inmediata'],
      benefits: ['Seguro médico', 'Alimentación', 'Transporte'],
      city: 'Managua',
      country: 'Nicaragua',
      salaryMin: 12000,
      salaryMax: 16000,
      currency: 'NIO',
      employmentType: 'Tiempo completo',
      modality: 'presencial',
      status: 'active',
      specialtySelections: {
        create: [{ specialty: { connect: { id: 'security_guard' } } }],
      },
    },
  });

  const jobLimpieza = await prisma.job.create({
    data: {
      companyId: limpioMas.id,
      categoryId: 'cleaning',
      title: 'Auxiliar de limpieza',
      description: 'Se requiere personal para limpieza de oficinas y áreas comunes.',
      requirements: ['Disponibilidad inmediata', 'Referencias laborales'],
      benefits: ['Contrato directo', 'Prestaciones de ley'],
      city: 'Masaya',
      country: 'Nicaragua',
      salaryMin: 9500,
      salaryMax: 11000,
      currency: 'NIO',
      employmentType: 'Tiempo completo',
      modality: 'presencial',
      status: 'active',
      specialtySelections: {
        create: [{ specialty: { connect: { id: 'home_cleaning' } } }],
      },
    },
  });

  const jobBodeguero = await prisma.job.create({
    data: {
      companyId: bodegasNorte.id,
      categoryId: 'warehouse',
      title: 'Bodeguero',
      description: 'Encargado de recepción, almacenamiento y despacho de mercadería.',
      requirements: ['Experiencia en bodega', 'Manejo de inventarios', 'Licencia de conducir (deseable)'],
      benefits: ['Bono por productividad', 'Horario estable'],
      city: 'León',
      country: 'Nicaragua',
      salaryMin: 11000,
      salaryMax: 13000,
      currency: 'NIO',
      employmentType: 'Tiempo completo',
      modality: 'presencial',
      status: 'active',
      specialtySelections: {
        create: [{ specialty: { connect: { id: 'warehouse_assistant' } } }],
      },
    },
  });

  console.log('📝 Creando postulaciones...');

  const applicationCarlos = await prisma.application.create({
    data: {
      jobId: jobGuardia.id,
      candidateId: candidateCarlos.candidateProfile!.id,
      status: 'reviewing',
    },
  });

  const applicationMaria = await prisma.application.create({
    data: {
      jobId: jobGuardia.id,
      candidateId: candidateMaria.candidateProfile!.id,
      status: 'interview_scheduled',
    },
  });

  await prisma.application.create({
    data: {
      jobId: jobLimpieza.id,
      candidateId: candidateValeria.candidateProfile!.id,
      status: 'applied',
    },
  });

  await prisma.application.create({
    data: {
      jobId: jobBodeguero.id,
      candidateId: candidateAndres.candidateProfile!.id,
      status: 'preselected',
    },
  });

  console.log('📅 Creando entrevistas...');

  await prisma.interview.create({
    data: {
      applicationId: applicationMaria.id,
      companyId: segurimax.id,
      candidateId: candidateMaria.candidateProfile!.id,
      jobId: jobGuardia.id,
      date: new Date('2026-05-20T09:00:00'),
      modality: 'presencial',
      location: 'Oficinas Segurimax, Managua',
      status: 'pending_confirmation',
      notesForCandidate: 'Presentarse con cédula original y copia.',
      responsibleUserId: companyRecruiterSegurimax.id,
    },
  });

  console.log('💬 Creando mensajes...');

  await prisma.message.create({
    data: {
      companyId: segurimax.id,
      candidateId: candidateCarlos.candidateProfile!.id,
      applicationId: applicationCarlos.id,
      type: 'interview_invitation',
      title: 'Invitación a entrevista',
      body: 'Hola Carlos, te invitamos a una entrevista para el puesto de Guardia de seguridad.',
      status: 'unread',
      sentAt: new Date(),
    },
  });

  console.log('📎 Creando documentos...');

  await prisma.candidateDocument.createMany({
    data: [
      {
        candidateId: candidateCarlos.candidateProfile!.id,
        type: 'id_front',
        status: 'pending',
      },
      {
        candidateId: candidateCarlos.candidateProfile!.id,
        type: 'id_back',
        status: 'approved',
        fileUrl: 'https://storage.empleo.com.ni/docs/carlos-id-back.jpg',
        uploadedAt: new Date(),
      },
      {
        candidateId: candidateCarlos.candidateProfile!.id,
        type: 'cv',
        status: 'uploaded',
        fileUrl: 'https://storage.empleo.com.ni/docs/carlos-cv.pdf',
        uploadedAt: new Date(),
      },
    ],
  });

  console.log('💳 Creando suscripciones y pagos...');

  await prisma.billingSubscription.create({
    data: {
      companyId: segurimax.id,
      planId: planProfessional.id,
      status: 'active',
    },
  });

  await prisma.billingPayment.create({
    data: {
      companyId: segurimax.id,
      planId: planProfessional.id,
      amount: 2500,
      currency: 'NIO',
      status: 'paid',
      paymentDate: new Date(),
      reference: 'PAY-001',
    },
  });

  console.log('⚙️ Creando configuración de plataforma...');

  await prisma.platformSettings.create({
    data: {
      id: 'global',
      settings: {
        planLimits: {
          basic: { publications: 10, users: 3, candidates: 200 },
          professional: { publications: 30, users: 5, candidates: 500 },
          enterprise: { publications: null, users: null, candidates: null },
        },
        visibility: {
          allowAnonymousJobView: true,
          requirePhoneVerification: false,
        },
        billing: {
          currency: 'NIO',
          taxRate: 15,
        },
      },
    },
  });

  console.log('📋 Creando plantillas de mensajes...');

  await prisma.messageTemplate.createMany({
    data: [
      {
        companyId: null, // Global
        name: 'Invitación a entrevista',
        type: 'interview_invitation',
        subject: 'Te invitamos a una entrevista',
        body: 'Hola {{candidateName}}, nos complace invitarte a una entrevista para el puesto de {{jobTitle}}.',
      },
      {
        companyId: null,
        name: 'Solicitud de documentos',
        type: 'document_request',
        subject: 'Documentos requeridos',
        body: 'Hola {{candidateName}}, para continuar con tu proceso necesitamos que subas los siguientes documentos: {{documents}}.',
      },
      {
        companyId: null,
        name: 'Recordatorio de entrevista',
        type: 'reminder',
        subject: 'Recordatorio: Tu entrevista es mañana',
        body: 'Hola {{candidateName}}, te recordamos que tienes una entrevista programada para mañana a las {{time}}.',
      },
    ],
  });

  console.log('✅ Seed completado exitosamente!');
  console.log('');
  console.log('📋 Credenciales de acceso al portal web:');
  console.log('   🔐 Super Admin: admin@empleofacil.com / Admin123!');
  console.log('   🏢 Empresa Test: empresa@test.com / Empresa123!');
  console.log('');
  console.log('📋 Otros usuarios de prueba:');
  console.log('   SuperAdmin: superadmin@empleo.com.ni / Demo1234');
  console.log('   Company Admin: carlos.mendoza@segurimax.com.ni / Demo1234');
  console.log('   Company Recruiter: maria.perez@segurimax.com.ni / Demo1234');
  console.log('   Candidato: +50588888888 / Demo1234');
}

main()
  .catch((error) => {
    console.error('❌ Seed error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
