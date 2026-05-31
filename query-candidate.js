const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { phone: '+50588888888' },
    include: { candidateProfile: true, companyUsers: true },
  });
  console.log('User:', JSON.stringify(user, null, 2));

  if (user?.candidateProfile?.id) {
    const candidateId = user.candidateProfile.id;
    const applications = await prisma.application.findMany({
      where: { candidateId },
      include: {
        job: { include: { company: true } },
      },
      orderBy: { appliedAt: 'desc' },
    });
    console.log('\nCandidateId:', candidateId);
    console.log('\nApplications count:', applications.length);
    applications.forEach((app, i) => {
      console.log(`\n--- App ${i + 1} ---`);
      console.log('id:', app.id);
      console.log('status:', app.status);
      console.log('appliedAt:', app.appliedAt);
      console.log('jobId:', app.jobId);
      console.log('jobTitle:', app.job?.title);
      console.log('company:', app.job?.company?.name);
      console.log('jobStatus:', app.job?.status);
    });
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
