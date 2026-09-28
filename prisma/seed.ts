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
      { id: 'security', name: 'Seguridad', icon: 'shield', sortOrder: 2 },
      { id: 'janitor', name: 'Servicios generales', icon: 'keys', sortOrder: 3 },
      { id: 'warehouse', name: 'Logística y bodega', icon: 'box', sortOrder: 4 },
      { id: 'customer_service', name: 'Atención al cliente y ventas', icon: 'headset', sortOrder: 5 },
      { id: 'administration', name: 'Administración y oficina', icon: 'clipboard', sortOrder: 6 },
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
