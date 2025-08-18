const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin@pamoja.com';
  const password = 'ABCabc123#';
  const hash = await bcrypt.hash(password, 10);
  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    await prisma.user.create({
      data: {
        name: 'Administrateur',
        email,
        password: hash,
        role: 'ADMIN',
      },
    });
    console.log('Admin user created:', email);
  } else {
    console.log('Admin user already exists:', email);
  }
  await prisma.$disconnect();
}

createAdmin();
