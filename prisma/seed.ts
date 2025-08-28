import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Criar usuário de exemplo
  const user = await prisma.user.upsert({
    where: { email: "teste@exemplo.com" },
    update: {},
    create: {
      name: "Usuário Teste",
      email: "teste@exemplo.com",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Criar dados de gamificação
  await prisma.gamification.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      totalXP: 2500,
      currentLevel: 3,
      xpToNextLevel: 500,
      currentStreak: 7,
      longestStreak: 15,
      coursesCompleted: 5,
      lessonsCompleted: 25,
      quizzesCompleted: 10,
      certificatesEarned: 2,
      lastStudyDate: new Date(),
    },
  });

  console.log("✅ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
