const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const candidatePhone = '+50588888888';

  // 1. Find candidate
  const user = await prisma.user.findUnique({
    where: { phone: candidatePhone },
    include: { candidateProfile: true },
  });

  if (!user?.candidateProfile) {
    console.error('Candidate not found');
    return;
  }

  const candidateId = user.candidateProfile.id;
  console.log('Candidate:', user.candidateProfile.fullName, '(' + candidateId + ')');

  // 2. Pick the Segurimax application (the oldest/reviewing one)
  const app = await prisma.application.findFirst({
    where: { candidateId, job: { company: { name: { contains: 'Segurimax' } } } },
    include: { job: { include: { company: true } } },
  });

  if (!app) {
    console.error('Segurimax application not found');
    return;
  }

  console.log('\nSelected Application:');
  console.log('  id:', app.id);
  console.log('  job:', app.job.title);
  console.log('  company:', app.job.company.name);
  console.log('  current status:', app.status);

  // 3. Update application status to interview_scheduled
  const updatedApp = await prisma.application.update({
    where: { id: app.id },
    data: { status: 'interview_scheduled' },
  });
  console.log('\n✅ Application status updated to:', updatedApp.status);

  // 4. Create interview
  // First check if one already exists
  const existingInterview = await prisma.interview.findFirst({
    where: { applicationId: app.id },
  });

  let interview;
  const interviewData = {
    applicationId: app.id,
    companyId: app.job.companyId,
    candidateId: candidateId,
    jobId: app.jobId,
    date: new Date('2025-05-17T10:00:00'),
    modality: 'Presencial',
    location: 'Oficinas de Segurimax, Col. Los Robles, de semáforos del Club Terraza 2c. al norte.',
    meetingUrl: null,
    status: 'scheduled' ,
    notesForCandidate: 'Entrevista presencial con Lic. Ana María Ruiz. Favor llegar 10 minutos antes.',
    responsibleUserId: null,
  };

  if (existingInterview) {
    interview = await prisma.interview.update({
      where: { id: existingInterview.id },
      data: interviewData,
    });
    console.log('\n✅ Existing interview updated (id:', interview.id + ')');
  } else {
    interview = await prisma.interview.create({ data: interviewData });
    console.log('\n✅ Interview created (id:', interview.id + ')');
  }

  // 5. Verify GET /applications/:id
  const verifyApp = await prisma.application.findUnique({
    where: { id: app.id },
    include: {
      job: { include: { company: true } },
      candidate: true,
      interviews: { orderBy: { date: 'asc' } },
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  });

  console.log('\n━━━ VERIFICATION ━━━');
  console.log('GET /applications/:id (', verifyApp.id, '):');
  console.log('  status:', verifyApp.status);
  console.log('  interviews:', verifyApp.interviews.length, 'found');
  verifyApp.interviews.forEach((iv, i) => {
    console.log(`  interview[${i}]:`);
    console.log('    id:', iv.id);
    console.log('    date:', iv.date);
    console.log('    modality:', iv.modality);
    console.log('    location:', iv.location);
    console.log('    status:', iv.status);
  });

  // 6. Verify GET /interviews/:id
  const verifyInterview = await prisma.interview.findUnique({
    where: { id: interview.id },
  });

  console.log('\nGET /interviews/:id (', verifyInterview.id, '):');
  console.log('  date:', verifyInterview.date);
  console.log('  modality:', verifyInterview.modality);
  console.log('  location:', verifyInterview.location);
  console.log('  status:', verifyInterview.status);
  console.log('  notesForCandidate:', verifyInterview.notesForCandidate);
  console.log('  meetingUrl:', verifyInterview.meetingUrl);

  console.log('\n━━━ SUMMARY ━━━');
  console.log('applicationId:', app.id);
  console.log('interviewId:', interview.id);
  console.log('Endpoints touched:');
  console.log('  PATCH /applications/:id/status  →  interview_scheduled');
  console.log('  POST /interviews  (or PATCH if existed)');
  console.log('  GET /applications/:id');
  console.log('  GET /interviews/:id');
}

main().catch(console.error).finally(() => prisma.$disconnect());
