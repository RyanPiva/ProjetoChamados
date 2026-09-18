const { PrismaClient, UserRole } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash('123456', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@empresa.com' },
    update: { passwordHash },
    create: {
      email: 'admin@empresa.com',
      name: 'Administrador',
      role: UserRole.ADMIN,
      passwordHash,
    },
  });

  const agent = await prisma.user.upsert({
    where: { email: 'suporte@empresa.com' },
    update: { passwordHash },
    create: {
      email: 'suporte@empresa.com',
      name: 'Equipe de Suporte',
      role: UserRole.AGENT,
      passwordHash,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'usuario@empresa.com' },
    update: { passwordHash },
    create: {
      email: 'usuario@empresa.com',
      name: 'João Silva',
      role: UserRole.USER,
      passwordHash,
    },
  });

  await prisma.ticket.upsert({
    where: { id: 'seed-ticket-1' },
    update: {},
    create: {
      id: 'seed-ticket-1',
      title: 'Computador não liga',
      description: 'Meu computador não liga desde esta manhã. Já tentei trocar a tomada.',
      priority: 'HIGH',
      category: 'Hardware',
      status: 'OPEN',
      creatorId: user.id,
      assigneeId: agent.id,
    },
  });

  console.log('Seed concluído:', {
    admin: admin.email,
    agent: agent.email,
    user: user.email,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
