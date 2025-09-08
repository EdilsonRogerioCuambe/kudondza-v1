import slugify from "slugify";
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

// ID do usuário existente (será usado como instrutor/admin)
const EXISTING_USER_ID = "sdSgu7eI8JHlDkAtcTHhhYfZYDldWNym";

// Função para gerar slug
function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: "pt",
  });
}

async function seedFoundationData() {
  console.log("🌱 Criando dados fundamentais...");

  // 1. Criar Categorias
  const categories = [
    {
      name: "Frontend Development",
      description:
        "Desenvolvimento de interfaces de usuário e experiência do usuário",
      icon: "🎨",
      color: "#3B82F6",
      image: "https://example.com/frontend-cover.jpg",
      isActive: true,
      isFeatured: true,
      sortOrder: 1,
      seoTitle: "Cursos de Frontend Development",
      seoDescription:
        "Aprenda HTML, CSS, JavaScript, React e outras tecnologias frontend",
      seoKeywords: ["html", "css", "javascript", "react", "vue", "angular"],
      courseCount: 0,
    },
    {
      name: "Backend Development",
      description: "Desenvolvimento de APIs, servidores e lógica de negócio",
      icon: "⚙️",
      color: "#10B981",
      image: "https://example.com/backend-cover.jpg",
      isActive: true,
      isFeatured: true,
      sortOrder: 2,
      seoTitle: "Cursos de Backend Development",
      seoDescription:
        "Aprenda Node.js, Python, Java, SQL e desenvolvimento de APIs",
      seoKeywords: ["nodejs", "python", "java", "api", "database", "sql"],
      courseCount: 0,
    },
    {
      name: "Mobile Development",
      description: "Desenvolvimento de aplicativos móveis para iOS e Android",
      icon: "📱",
      color: "#8B5CF6",
      image: "https://example.com/mobile-cover.jpg",
      isActive: true,
      isFeatured: true,
      sortOrder: 3,
      seoTitle: "Cursos de Mobile Development",
      seoDescription:
        "Aprenda React Native, Flutter, iOS e Android development",
      seoKeywords: ["react-native", "flutter", "ios", "android", "mobile"],
      courseCount: 0,
    },
    {
      name: "DevOps & Cloud",
      description: "Infraestrutura, deploy e gerenciamento de aplicações",
      icon: "☁️",
      color: "#F59E0B",
      image: "https://example.com/devops-cover.jpg",
      isActive: true,
      isFeatured: false,
      sortOrder: 4,
      seoTitle: "Cursos de DevOps e Cloud",
      seoDescription: "Aprenda Docker, Kubernetes, AWS, CI/CD e infraestrutura",
      seoKeywords: ["docker", "kubernetes", "aws", "cicd", "devops"],
      courseCount: 0,
    },
  ];

  const createdCategories = [];
  for (const categoryData of categories) {
    const category = await prisma.category.create({
      data: {
        ...categoryData,
        slug: generateSlug(categoryData.name),
      },
    });
    createdCategories.push(category);
    console.log(`✅ Categoria criada: ${category.name}`);
  }

  // 2. Criar Subcategorias
  const subcategoriesData = [
    {
      name: "React",
      description: "Biblioteca JavaScript para construção de interfaces",
      icon: "⚛️",
      color: "#61DAFB",
      categorySlug: "frontend-development",
      sortOrder: 1,
      courseCount: 0,
    },
    {
      name: "Vue.js",
      description: "Framework JavaScript progressivo",
      icon: "💚",
      color: "#4FC08D",
      categorySlug: "frontend-development",
      sortOrder: 2,
      courseCount: 0,
    },
    {
      name: "Node.js",
      description: "JavaScript runtime para desenvolvimento backend",
      icon: "🟢",
      color: "#339933",
      categorySlug: "backend-development",
      sortOrder: 1,
      courseCount: 0,
    },
    {
      name: "Python",
      description: "Linguagem de programação versátil",
      icon: "🐍",
      color: "#3776AB",
      categorySlug: "backend-development",
      sortOrder: 2,
      courseCount: 0,
    },
  ];

  const createdSubcategories = [];
  for (const subData of subcategoriesData) {
    const category = await prisma.category.findUnique({
      where: { slug: subData.categorySlug },
    });

    if (category) {
      const subcategory = await prisma.subcategory.create({
        data: {
          name: subData.name,
          slug: generateSlug(subData.name),
          description: subData.description,
          icon: subData.icon,
          color: subData.color,
          categoryId: category.id,
          sortOrder: subData.sortOrder,
          courseCount: subData.courseCount,
          isActive: true,
        },
      });
      createdSubcategories.push(subcategory);
      console.log(`✅ Subcategoria criada: ${subcategory.name}`);
    }
  }

  // 3. Criar Badges
  const badgesData = [
    {
      name: "Primeiro Curso",
      description: "Completou seu primeiro curso na plataforma",
      icon: "🎓",
      color: "#3B82F6",
      rarity: "COMMON" as const,
      xpReward: 100,
      criteria: {
        type: "course_completion",
        count: 1,
      },
      isActive: true,
      isLimited: false,
    },
    {
      name: "Madrugador",
      description: "Fez login antes das 7h da manhã por 7 dias consecutivos",
      icon: "🌅",
      color: "#F59E0B",
      rarity: "UNCOMMON" as const,
      xpReward: 200,
      criteria: {
        type: "early_login_streak",
        count: 7,
        time: "07:00",
      },
      isActive: true,
      isLimited: false,
    },
    {
      name: "Mestre do Código",
      description: "Completou 10 cursos de programação",
      icon: "👨‍💻",
      color: "#10B981",
      rarity: "RARE" as const,
      xpReward: 500,
      criteria: {
        type: "course_completion",
        count: 10,
        category: "programming",
      },
      isActive: true,
      isLimited: false,
    },
  ];

  const createdBadges = [];
  for (const badgeData of badgesData) {
    const badge = await prisma.badge.create({
      data: badgeData,
    });
    createdBadges.push(badge);
    console.log(`✅ Badge criada: ${badge.name}`);
  }

  // 4. Criar Desafios Diários
  const dailyChallengesData = [
    {
      title: "30 Minutos de Estudo",
      description: "Estude por pelo menos 30 minutos hoje",
      type: "STUDY_TIME" as const,
      target: 1800,
      reward: 50,
      isActive: true,
      isRecurring: true,
    },
    {
      title: "Complete uma Aula",
      description: "Complete pelo menos uma aula hoje",
      type: "LESSON_COMPLETION" as const,
      target: 1,
      reward: 75,
      isActive: true,
      isRecurring: true,
    },
    {
      title: "Acerte um Quiz",
      description: "Complete um quiz com pelo menos 80% de acertos",
      type: "QUIZ_COMPLETION" as const,
      target: 1,
      reward: 100,
      isActive: true,
      isRecurring: true,
    },
  ];

  const createdChallenges = [];
  for (const challengeData of dailyChallengesData) {
    const challenge = await prisma.dailyChallenge.create({
      data: challengeData,
    });
    createdChallenges.push(challenge);
    console.log(`✅ Desafio diário criado: ${challenge.title}`);
  }

  // 5. Criar Recompensas por Nível
  const levelRewardsData = [
    {
      level: 1,
      title: "Bem-vindo!",
      description: "Parabéns por começar sua jornada de aprendizado",
      type: "BADGE" as const,
      value: "badge_welcome",
      xpReward: 0,
      isActive: true,
    },
    {
      level: 5,
      title: "Aprendiz Dedicado",
      description:
        "Você desbloqueou a funcionalidade de playlists personalizadas",
      type: "FEATURE_UNLOCK" as const,
      value: "custom_playlists",
      xpReward: 100,
      isActive: true,
    },
    {
      level: 10,
      title: "Estudante Avançado",
      description: "Você ganhou acesso aos grupos de estudo",
      type: "FEATURE_UNLOCK" as const,
      value: "study_groups",
      xpReward: 250,
      isActive: true,
    },
  ];

  const createdLevelRewards = [];
  for (const rewardData of levelRewardsData) {
    const reward = await prisma.levelReward.create({
      data: rewardData,
    });
    createdLevelRewards.push(reward);
    console.log(`✅ Recompensa de nível criada: Nível ${reward.level}`);
  }

  return {
    categories: createdCategories,
    subcategories: createdSubcategories,
    badges: createdBadges,
    challenges: createdChallenges,
    levelRewards: createdLevelRewards,
  };
}

async function seedCoursesAndContent(_foundationData: unknown) {
  console.log("📚 Criando cursos específicos...");

  // Buscar categorias
  const frontendCategory = await prisma.category.findUnique({
    where: { slug: "frontend-development" },
  });
  const backendCategory = await prisma.category.findUnique({
    where: { slug: "backend-development" },
  });
  const reactSubcategory = await prisma.subcategory.findUnique({
    where: { slug: "react" },
  });
  const nodejsSubcategory = await prisma.subcategory.findUnique({
    where: { slug: "nodejs" },
  });

  if (!frontendCategory || !backendCategory) {
    throw new Error("Categorias não encontradas");
  }

  // Definir os 8 cursos específicos
  const coursesData = [
    {
      title: "Node.js Completo",
      description:
        "Aprenda Node.js do zero ao avançado: APIs REST, WebSockets, autenticação, testes e deploy em produção.",
      shortDescription: "Domine Node.js para desenvolvimento backend moderno",
      thumbnail: "https://example.com/courses/nodejs-completo.jpg",
      trailer: "https://example.com/trailers/nodejs-completo.mp4",
      categoryId: backendCategory.id,
      subcategoryId: nodejsSubcategory?.id,
      tags: ["nodejs", "javascript", "backend", "api", "express"],
      level: "INTERMEDIATE" as const,
      language: "pt",
      duration: 2400,
      price: 399.0,
      originalPrice: 499.0,
      currency: "BRL",
      isPublic: true,
      isPremium: false,
      allowDownload: true,
      hasPrerequisites: true,
      status: "PUBLISHED" as const,
      publishedAt: new Date("2024-08-15T10:00:00Z"),
      seoTitle: "Curso Node.js Completo - Backend Development",
      seoDescription:
        "Aprenda Node.js do zero ao avançado com projetos práticos",
      seoKeywords: ["nodejs", "backend", "javascript", "api", "express"],
      xpReward: 800,
      instructorId: EXISTING_USER_ID,
      viewCount: 1250,
      downloadCount: 89,
      shareCount: 45,
      favoriteCount: 234,
      isFeatured: true,
      featuredAt: new Date("2024-08-20T10:00:00Z"),
      trendingScore: 9.2,
    },
    {
      title: "Docker & Containerização",
      description:
        "Domine Docker: containers, imagens, Dockerfile, Docker Compose, orquestração e deploy em produção.",
      shortDescription: "Aprenda Docker e containerização do zero",
      thumbnail: "https://example.com/courses/docker-completo.jpg",
      trailer: "https://example.com/trailers/docker-completo.mp4",
      categoryId: backendCategory.id,
      tags: ["docker", "containers", "devops", "deploy", "orquestração"],
      level: "INTERMEDIATE" as const,
      language: "pt",
      duration: 1800,
      price: 349.0,
      originalPrice: 449.0,
      currency: "BRL",
      isPublic: true,
      isPremium: false,
      allowDownload: true,
      hasPrerequisites: false,
      status: "PUBLISHED" as const,
      publishedAt: new Date("2024-08-10T10:00:00Z"),
      seoTitle: "Curso Docker Completo - Containerização",
      seoDescription: "Aprenda Docker e containerização com projetos práticos",
      seoKeywords: ["docker", "containers", "devops", "deploy"],
      xpReward: 700,
      instructorId: EXISTING_USER_ID,
      viewCount: 980,
      downloadCount: 67,
      shareCount: 32,
      favoriteCount: 189,
      isFeatured: true,
      featuredAt: new Date("2024-08-18T10:00:00Z"),
      trendingScore: 8.8,
    },
    {
      title: "React Avançado",
      description:
        "React moderno: hooks avançados, context, reducers, performance, testes e padrões de arquitetura.",
      shortDescription: "React avançado para desenvolvedores experientes",
      thumbnail: "https://example.com/courses/react-avancado.jpg",
      trailer: "https://example.com/trailers/react-avancado.mp4",
      categoryId: frontendCategory.id,
      subcategoryId: reactSubcategory?.id,
      tags: ["react", "hooks", "context", "performance", "testes"],
      level: "ADVANCED" as const,
      language: "pt",
      duration: 2000,
      price: 449.0,
      originalPrice: 549.0,
      currency: "BRL",
      isPublic: true,
      isPremium: true,
      allowDownload: true,
      hasPrerequisites: true,
      status: "PUBLISHED" as const,
      publishedAt: new Date("2024-07-20T10:00:00Z"),
      seoTitle: "Curso React Avançado - Hooks e Performance",
      seoDescription: "React avançado com hooks, context e otimizações",
      seoKeywords: ["react", "hooks", "context", "performance", "avancado"],
      xpReward: 900,
      instructorId: EXISTING_USER_ID,
      viewCount: 1100,
      downloadCount: 78,
      shareCount: 41,
      favoriteCount: 267,
      isFeatured: true,
      featuredAt: new Date("2024-08-22T10:00:00Z"),
      trendingScore: 9.0,
    },
    {
      title: "Redis & Cache",
      description:
        "Domine Redis: cache, sessões, pub/sub, clustering, persistência e otimização de performance.",
      shortDescription: "Aprenda Redis para cache e performance",
      thumbnail: "https://example.com/courses/redis-cache.jpg",
      trailer: "https://example.com/trailers/redis-cache.mp4",
      categoryId: backendCategory.id,
      tags: ["redis", "cache", "performance", "database", "nosql"],
      level: "INTERMEDIATE" as const,
      language: "pt",
      duration: 1200,
      price: 299.0,
      originalPrice: 399.0,
      currency: "BRL",
      isPublic: true,
      isPremium: false,
      allowDownload: true,
      hasPrerequisites: true,
      status: "PUBLISHED" as const,
      publishedAt: new Date("2024-08-05T10:00:00Z"),
      seoTitle: "Curso Redis - Cache e Performance",
      seoDescription: "Aprenda Redis para cache e otimização de performance",
      seoKeywords: ["redis", "cache", "performance", "database"],
      xpReward: 600,
      instructorId: EXISTING_USER_ID,
      viewCount: 750,
      downloadCount: 45,
      shareCount: 28,
      favoriteCount: 156,
      isFeatured: false,
      trendingScore: 7.8,
    },
    {
      title: "CSS Moderno",
      description:
        "CSS moderno: Grid, Flexbox, animações, variáveis CSS, responsividade e metodologias.",
      shortDescription: "CSS moderno e responsivo do zero",
      thumbnail: "https://example.com/courses/css-moderno.jpg",
      trailer: "https://example.com/trailers/css-moderno.mp4",
      categoryId: frontendCategory.id,
      tags: ["css", "grid", "flexbox", "animations", "responsive"],
      level: "BEGINNER" as const,
      language: "pt",
      duration: 1600,
      price: 249.0,
      originalPrice: 349.0,
      currency: "BRL",
      isPublic: true,
      isPremium: false,
      allowDownload: true,
      hasPrerequisites: false,
      status: "PUBLISHED" as const,
      publishedAt: new Date("2024-07-15T10:00:00Z"),
      seoTitle: "Curso CSS Moderno - Grid e Flexbox",
      seoDescription: "Aprenda CSS moderno com Grid, Flexbox e animações",
      seoKeywords: ["css", "grid", "flexbox", "responsive", "animations"],
      xpReward: 500,
      instructorId: EXISTING_USER_ID,
      viewCount: 890,
      downloadCount: 56,
      shareCount: 35,
      favoriteCount: 198,
      isFeatured: false,
      trendingScore: 8.1,
    },
    {
      title: "HTML5 & Semântica",
      description:
        "HTML5 completo: elementos semânticos, acessibilidade, SEO, APIs nativas e boas práticas.",
      shortDescription: "HTML5 semântico e acessível",
      thumbnail: "https://example.com/courses/html5-semantica.jpg",
      trailer: "https://example.com/trailers/html5-semantica.mp4",
      categoryId: frontendCategory.id,
      tags: ["html5", "semantica", "acessibilidade", "seo", "apis"],
      level: "BEGINNER" as const,
      language: "pt",
      duration: 1000,
      price: 199.0,
      originalPrice: 299.0,
      currency: "BRL",
      isPublic: true,
      isPremium: false,
      allowDownload: true,
      hasPrerequisites: false,
      status: "PUBLISHED" as const,
      publishedAt: new Date("2024-07-01T10:00:00Z"),
      seoTitle: "Curso HTML5 - Semântica e Acessibilidade",
      seoDescription: "Aprenda HTML5 semântico e acessível",
      seoKeywords: ["html5", "semantica", "acessibilidade", "seo"],
      xpReward: 400,
      instructorId: EXISTING_USER_ID,
      viewCount: 1200,
      downloadCount: 89,
      shareCount: 52,
      favoriteCount: 245,
      isFeatured: true,
      featuredAt: new Date("2024-08-12T10:00:00Z"),
      trendingScore: 8.5,
    },
    {
      title: "Git & GitHub",
      description:
        "Controle de versão completo: Git, GitHub, workflows, CI/CD, colaboração e boas práticas.",
      shortDescription: "Git e GitHub para desenvolvedores",
      thumbnail: "https://example.com/courses/git-github.jpg",
      trailer: "https://example.com/trailers/git-github.mp4",
      categoryId: backendCategory.id,
      tags: ["git", "github", "version-control", "collaboration", "cicd"],
      level: "BEGINNER" as const,
      language: "pt",
      duration: 800,
      price: 179.0,
      originalPrice: 249.0,
      currency: "BRL",
      isPublic: true,
      isPremium: false,
      allowDownload: true,
      hasPrerequisites: false,
      status: "PUBLISHED" as const,
      publishedAt: new Date("2024-06-20T10:00:00Z"),
      seoTitle: "Curso Git e GitHub - Controle de Versão",
      seoDescription: "Aprenda Git e GitHub para controle de versão",
      seoKeywords: ["git", "github", "version-control", "collaboration"],
      xpReward: 350,
      instructorId: EXISTING_USER_ID,
      viewCount: 1500,
      downloadCount: 120,
      shareCount: 78,
      favoriteCount: 312,
      isFeatured: true,
      featuredAt: new Date("2024-08-08T10:00:00Z"),
      trendingScore: 9.3,
    },
    {
      title: "PostgreSQL Avançado",
      description:
        "PostgreSQL completo: queries avançadas, índices, transações, stored procedures e otimização.",
      shortDescription: "PostgreSQL avançado para desenvolvedores",
      thumbnail: "https://example.com/courses/postgresql-avancado.jpg",
      trailer: "https://example.com/trailers/postgresql-avancado.mp4",
      categoryId: backendCategory.id,
      tags: ["postgresql", "database", "sql", "queries", "optimization"],
      level: "INTERMEDIATE" as const,
      language: "pt",
      duration: 1800,
      price: 379.0,
      originalPrice: 479.0,
      currency: "BRL",
      isPublic: true,
      isPremium: true,
      allowDownload: true,
      hasPrerequisites: true,
      status: "PUBLISHED" as const,
      publishedAt: new Date("2024-08-01T10:00:00Z"),
      seoTitle: "Curso PostgreSQL Avançado - Database",
      seoDescription: "Aprenda PostgreSQL avançado com queries e otimização",
      seoKeywords: ["postgresql", "database", "sql", "queries", "avancado"],
      xpReward: 750,
      instructorId: EXISTING_USER_ID,
      viewCount: 650,
      downloadCount: 42,
      shareCount: 25,
      favoriteCount: 134,
      isFeatured: false,
      trendingScore: 8.2,
    },
  ];

  const createdCourses = [];
  for (const courseData of coursesData) {
    const course = await prisma.course.create({
      data: {
        ...courseData,
        slug: generateSlug(courseData.title),
      },
    });
    createdCourses.push(course);
    console.log(`✅ Curso criado: ${course.title}`);
  }

  // Atualizar contagem de cursos nas categorias
  await Promise.all([
    prisma.category.update({
      where: { id: frontendCategory.id },
      data: { courseCount: 3 }, // HTML5, CSS, React
    }),
    prisma.category.update({
      where: { id: backendCategory.id },
      data: { courseCount: 5 }, // Node.js, Docker, Redis, Git, PostgreSQL
    }),
  ]);

  await Promise.all([
    reactSubcategory &&
      prisma.subcategory.update({
        where: { id: reactSubcategory.id },
        data: { courseCount: 1 }, // React Avançado
      }),
    nodejsSubcategory &&
      prisma.subcategory.update({
        where: { id: nodejsSubcategory.id },
        data: { courseCount: 1 }, // Node.js Completo
      }),
  ]);

  console.log("✅ Contagem de cursos atualizada nas categorias");

  return {
    courses: createdCourses,
  };
}

async function seedCourseStructure(coursesData: unknown) {
  console.log("🏗️ Criando estrutura completa dos cursos...");

  const coursesDataTyped = coursesData as {
    courses: Array<{ slug: string; id: string; title: string }>;
  };

  const allModules = [];
  const allLessons = [];
  const allQuizzes = [];
  const allQuestions = [];

  // Definir estrutura para cada curso (10 módulos por curso)
  const courseStructures = {
    "nodejs-completo": {
      modules: [
        {
          title: "Fundamentos do Node.js",
          description: "Introdução ao Node.js, NPM e conceitos básicos",
        },
        {
          title: "Express.js e APIs REST",
          description: "Criando APIs RESTful com Express.js",
        },
        {
          title: "Autenticação e Segurança",
          description: "JWT, bcrypt, middleware de segurança",
        },
        {
          title: "Banco de Dados e ORM",
          description: "MongoDB, Mongoose, queries e relacionamentos",
        },
        {
          title: "WebSockets e Real-time",
          description: "Socket.io, comunicação em tempo real",
        },
        {
          title: "Testes e Qualidade",
          description: "Jest, Mocha, testes unitários e integração",
        },
        {
          title: "Performance e Otimização",
          description: "Clustering, caching, profiling",
        },
        {
          title: "Deploy e Produção",
          description: "Docker, PM2, monitoramento",
        },
        {
          title: "Microserviços",
          description: "Arquitetura de microserviços com Node.js",
        },
        {
          title: "Projeto Final",
          description: "Aplicação completa com todas as tecnologias",
        },
      ],
    },
    "docker-containerizacao": {
      modules: [
        {
          title: "Introdução ao Docker",
          description: "Conceitos básicos, imagens e containers",
        },
        {
          title: "Dockerfile e Build",
          description: "Criando imagens customizadas",
        },
        {
          title: "Docker Compose",
          description: "Orquestração de múltiplos containers",
        },
        {
          title: "Volumes e Networks",
          description: "Persistência de dados e comunicação",
        },
        {
          title: "Registry e Distribuição",
          description: "Docker Hub, registries privados",
        },
        { title: "Docker Swarm", description: "Orquestração nativa do Docker" },
        { title: "Kubernetes Básico", description: "Introdução ao Kubernetes" },
        {
          title: "CI/CD com Docker",
          description: "Integração contínua e deploy",
        },
        {
          title: "Monitoramento e Logs",
          description: "Observabilidade em containers",
        },
        {
          title: "Projeto Final",
          description: "Aplicação completa containerizada",
        },
      ],
    },
    "react-avancado": {
      modules: [
        {
          title: "Hooks Avançados",
          description: "useReducer, useContext, custom hooks",
        },
        {
          title: "Context API e State Management",
          description: "Gerenciamento de estado global",
        },
        {
          title: "Performance e Otimização",
          description: "React.memo, useMemo, useCallback",
        },
        {
          title: "Testes com React",
          description: "Jest, React Testing Library",
        },
        {
          title: "Padrões e Arquitetura",
          description: "Compound components, render props",
        },
        { title: "Server-Side Rendering", description: "Next.js, SSR, SSG" },
        {
          title: "PWA e Offline",
          description: "Service Workers, cache strategies",
        },
        {
          title: "GraphQL e React",
          description: "Apollo Client, queries e mutations",
        },
        {
          title: "React Native",
          description: "Desenvolvimento mobile com React",
        },
        { title: "Projeto Final", description: "Aplicação React completa" },
      ],
    },
    "redis-cache": {
      modules: [
        {
          title: "Fundamentos do Redis",
          description: "Instalação, comandos básicos, tipos de dados",
        },
        {
          title: "Cache e Performance",
          description: "Estratégias de cache, TTL, invalidação",
        },
        {
          title: "Sessões e Autenticação",
          description: "Gerenciamento de sessões com Redis",
        },
        {
          title: "Pub/Sub e Messaging",
          description: "Sistema de mensageria e notificações",
        },
        {
          title: "Clustering e Persistência",
          description: "Redis Cluster, RDB, AOF",
        },
        {
          title: "Integração com Node.js",
          description: "Redis com Express, middleware",
        },
        {
          title: "Integração com Python",
          description: "Redis com Django, Flask",
        },
        {
          title: "Monitoramento e Debugging",
          description: "Redis CLI, ferramentas de monitoramento",
        },
        {
          title: "Casos de Uso Avançados",
          description: "Rate limiting, leaderboards",
        },
        { title: "Projeto Final", description: "Sistema de cache completo" },
      ],
    },
    "css-moderno": {
      modules: [
        {
          title: "CSS Grid Layout",
          description: "Grid system, áreas, linhas e colunas",
        },
        {
          title: "Flexbox Avançado",
          description: "Flexbox para layouts complexos",
        },
        {
          title: "Animações e Transições",
          description: "CSS animations, keyframes, transforms",
        },
        {
          title: "Variáveis CSS e Custom Properties",
          description: "CSS custom properties, theming",
        },
        {
          title: "Responsividade e Mobile First",
          description: "Media queries, mobile-first design",
        },
        { title: "CSS-in-JS", description: "Styled-components, emotion" },
        {
          title: "Sass e Preprocessadores",
          description: "Sass, Less, variáveis e mixins",
        },
        { title: "Performance CSS", description: "Otimização, critical CSS" },
        { title: "Design Systems", description: "Componentes reutilizáveis" },
        {
          title: "Projeto Final",
          description: "Interface completa e responsiva",
        },
      ],
    },
    "html5-semantica": {
      modules: [
        {
          title: "Elementos Semânticos",
          description: "header, nav, main, section, article, aside, footer",
        },
        {
          title: "Acessibilidade Web",
          description: "ARIA, screen readers, navegação por teclado",
        },
        {
          title: "SEO e Meta Tags",
          description: "Meta tags, structured data, sitemap",
        },
        {
          title: "APIs Nativas do HTML5",
          description: "Geolocation, Web Storage, Web Workers",
        },
        {
          title: "Formulários Avançados",
          description: "Validação, novos tipos de input, constraints",
        },
        { title: "Canvas e SVG", description: "Gráficos e animações" },
        { title: "Web Components", description: "Custom elements, shadow DOM" },
        {
          title: "Progressive Web Apps",
          description: "Manifest, service workers",
        },
        {
          title: "Performance e Otimização",
          description: "Lazy loading, critical rendering path",
        },
        { title: "Projeto Final", description: "Site completo e acessível" },
      ],
    },
    "git-github": {
      modules: [
        {
          title: "Fundamentos do Git",
          description: "Repositórios, commits, branches, merge",
        },
        {
          title: "GitHub e Colaboração",
          description: "Pull requests, issues, wikis",
        },
        {
          title: "Workflows e Branching",
          description: "GitFlow, GitHub Flow, feature branches",
        },
        {
          title: "CI/CD e Automação",
          description: "GitHub Actions, workflows, deploy automático",
        },
        {
          title: "Boas Práticas",
          description: "Commit messages, code review, troubleshooting",
        },
        { title: "Git Avançado", description: "Rebase, cherry-pick, hooks" },
        {
          title: "Integração com IDEs",
          description: "VS Code, IntelliJ, Git GUI",
        },
        {
          title: "Git LFS e Submodules",
          description: "Arquivos grandes, submódulos",
        },
        {
          title: "Segurança e Permissões",
          description: "SSH keys, GPG, branch protection",
        },
        {
          title: "Projeto Final",
          description: "Workflow completo de desenvolvimento",
        },
      ],
    },
    "postgresql-avancado": {
      modules: [
        {
          title: "Queries Avançadas",
          description: "Joins complexos, subqueries, window functions",
        },
        {
          title: "Índices e Performance",
          description: "Tipos de índices, query optimization",
        },
        {
          title: "Transações e Concorrência",
          description: "ACID, locks, isolation levels",
        },
        {
          title: "Stored Procedures e Functions",
          description: "PL/pgSQL, triggers, views",
        },
        {
          title: "Backup e Recuperação",
          description: "pg_dump, WAL, point-in-time recovery",
        },
        {
          title: "Replicação e Clustering",
          description: "Streaming replication, logical replication",
        },
        {
          title: "Extensões e Customização",
          description: "PostGIS, extensões úteis",
        },
        {
          title: "Monitoramento e Tuning",
          description: "pg_stat, query analysis",
        },
        {
          title: "Segurança e Permissões",
          description: "Roles, grants, row-level security",
        },
        {
          title: "Projeto Final",
          description: "Sistema de banco de dados completo",
        },
      ],
    },
  };

  // Criar estrutura para cada curso
  for (const course of coursesDataTyped.courses) {
    const courseSlug = course.slug;
    const structure =
      courseStructures[courseSlug as keyof typeof courseStructures];

    if (!structure) continue;

    console.log(`📚 Criando estrutura para: ${course.title}`);

    // Criar módulos para o curso
    const courseModules = [];
    for (let i = 0; i < structure.modules.length; i++) {
      const moduleData = structure.modules[i];
      const courseModule = await prisma.module.create({
        data: {
          courseId: course.id,
          title: moduleData.title,
          description: moduleData.description,
          order: i + 1,
          isRequired: true,
          isPublic: i === 0, // Primeiro módulo público
          xpReward: 100 + i * 25,
          slug: generateSlug(moduleData.title),
        },
      });
      courseModules.push(courseModule);
      allModules.push(courseModule);
      console.log(`  ✅ Módulo: ${courseModule.title}`);
    }

    // Criar aulas para cada módulo (10 aulas por módulo)
    for (const courseModule of courseModules) {
      const moduleNumber = courseModule.order;
      const lessonsPerModule = 10;

      for (let i = 1; i <= lessonsPerModule; i++) {
        const lessonTitle = `Aula ${i}: ${getLessonTitle(
          courseSlug,
          moduleNumber,
          i
        )}`;
        const lesson = await prisma.lesson.create({
          data: {
            moduleId: courseModule.id,
            title: lessonTitle,
            description: `Aula ${i} do módulo ${
              courseModule.title
            } - ${getLessonDescription(courseSlug, moduleNumber, i)}`,
            shortDescription: `Conteúdo da aula ${i}`,
            order: i,
            videoUrl: `https://example.com/videos/${courseSlug}/module-${moduleNumber}/lesson-${i}.mp4`,
            videoDuration: 300 + i * 30, // 5-8 minutos por aula
            transcript: `Transcrição da aula ${i} do módulo ${courseModule.title}`,
            isPreview: i === 1 && moduleNumber === 1, // Primeira aula do primeiro módulo
            isRequired: true,
            isPublic: i === 1 && moduleNumber === 1,
            xpReward: 25 + i * 5,
            slug: generateSlug(lessonTitle),
          },
        });
        allLessons.push(lesson);
      }
      console.log(
        `  ✅ ${lessonsPerModule} aulas criadas para: ${courseModule.title}`
      );
    }

    // Criar quiz para cada módulo
    for (const courseModule of courseModules) {
      const quiz = await prisma.quiz.create({
        data: {
          moduleId: courseModule.id,
          title: `Quiz: ${courseModule.title}`,
          description: `Teste seus conhecimentos sobre ${courseModule.title}`,
          order: 1,
          timeLimit: 20,
          passingScore: 70,
          maxAttempts: 3,
          shuffleQuestions: true,
          showResults: true,
          xpReward: 150,
          allowedQuestionTypes: [
            "MULTIPLE_CHOICE",
            "TRUE_FALSE",
            "MULTIPLE_SELECT",
          ],
        },
      });
      allQuizzes.push(quiz);

      // Criar questões para o quiz (5 questões por quiz)
      const questionsCount = 5;
      for (let i = 1; i <= questionsCount; i++) {
        const questionData = getQuestionData(courseSlug, courseModule.order, i);
        const question = await prisma.question.create({
          data: {
            quizId: quiz.id,
            ...questionData,
          },
        });
        allQuestions.push(question);
      }
      console.log(
        `  ✅ Quiz com ${questionsCount} questões criado para: ${courseModule.title}`
      );
    }
  }

  console.log(`✅ Estrutura completa criada:`);
  console.log(`  - ${allModules.length} módulos`);
  console.log(`  - ${allLessons.length} aulas`);
  console.log(`  - ${allQuizzes.length} quizzes`);
  console.log(`  - ${allQuestions.length} questões`);

  return {
    modules: allModules,
    lessons: allLessons,
    quizzes: allQuizzes,
    questions: allQuestions,
  };
}

// Funções auxiliares para gerar conteúdo específico
function getLessonTitle(
  courseSlug: string,
  moduleNumber: number,
  lessonNumber: number
): string {
  const titles = {
    "nodejs-completo": {
      1: [
        "Introdução ao Node.js",
        "Instalação e Configuração",
        "NPM e Gerenciamento de Pacotes",
        "Event Loop",
        "Módulos e Require",
        "Process e Global Objects",
        "File System",
        "HTTP Module",
        "Streams",
        "Debugging",
      ],
      2: [
        "Introdução ao Express",
        "Rotas e Middleware",
        "Request e Response",
        "Body Parser",
        "Static Files",
        "Template Engines",
        "Error Handling",
        "RESTful APIs",
        "API Documentation",
        "Testing APIs",
      ],
      3: [
        "Conceitos de Autenticação",
        "JWT Tokens",
        "Bcrypt e Hash",
        "Middleware de Auth",
        "Role-based Access",
        "OAuth 2.0",
        "Session Management",
        "Security Headers",
        "Rate Limiting",
        "CORS",
      ],
      4: [
        "MongoDB e Mongoose",
        "Schemas e Models",
        "CRUD Operations",
        "Queries Avançadas",
        "Relacionamentos",
        "Indexes",
        "Aggregation",
        "Transactions",
        "Connection Pooling",
        "Performance",
      ],
      5: [
        "WebSockets Básicos",
        "Socket.io Setup",
        "Eventos e Listeners",
        "Rooms e Namespaces",
        "Autenticação WebSocket",
        "Broadcasting",
        "Error Handling",
        "Scaling WebSockets",
        "Real-time Features",
        "Performance",
      ],
      6: [
        "Jest Setup",
        "Testes Unitários",
        "Testes de Integração",
        "Mocks e Stubs",
        "Test Coverage",
        "TDD e BDD",
        "E2E Testing",
        "CI/CD Testing",
        "Performance Testing",
        "Best Practices",
      ],
      7: [
        "Clustering",
        "PM2 Process Manager",
        "Caching Strategies",
        "Memory Management",
        "CPU Profiling",
        "Database Optimization",
        "Load Balancing",
        "CDN e Assets",
        "Compression",
        "Monitoring",
      ],
      8: [
        "Docker para Node.js",
        "Environment Variables",
        "Logging",
        "Health Checks",
        "SSL/HTTPS",
        "Backup Strategies",
        "Scaling",
        "Monitoring",
        "Alerting",
        "Maintenance",
      ],
      9: [
        "Microserviços Architecture",
        "Service Discovery",
        "API Gateway",
        "Message Queues",
        "Event Sourcing",
        "CQRS",
        "Distributed Transactions",
        "Service Mesh",
        "Monitoring",
        "Deployment",
      ],
      10: [
        "Projeto Setup",
        "Database Design",
        "API Development",
        "Authentication",
        "Frontend Integration",
        "Testing",
        "Deployment",
        "Monitoring",
        "Documentation",
        "Presentation",
      ],
    },
    "docker-containerizacao": {
      1: [
        "O que é Docker?",
        "Instalação do Docker",
        "Primeiro Container",
        "Imagens Docker",
        "Docker Hub",
        "Comandos Básicos",
        "Docker Desktop",
        "Linux Containers",
        "Windows Containers",
        "Docker vs VMs",
      ],
      2: [
        "Introdução ao Dockerfile",
        "FROM e Base Images",
        "RUN e Comandos",
        "COPY e ADD",
        "WORKDIR e ENV",
        "EXPOSE e Ports",
        "CMD vs ENTRYPOINT",
        "Multi-stage Builds",
        "Build Context",
        "Best Practices",
      ],
      3: [
        "Docker Compose Basics",
        "YAML Configuration",
        "Services e Networks",
        "Volumes no Compose",
        "Environment Variables",
        "Dependencies",
        "Scaling Services",
        "Health Checks",
        "Profiles",
        "Override Files",
      ],
      4: [
        "Volumes e Bind Mounts",
        "Named Volumes",
        "Volume Drivers",
        "Network Types",
        "Custom Networks",
        "Service Discovery",
        "Load Balancing",
        "Security",
        "Backup Volumes",
        "Performance",
      ],
      5: [
        "Docker Registry",
        "Docker Hub",
        "Private Registry",
        "Image Tagging",
        "Image Scanning",
        "Security",
        "Distribution",
        "Automation",
        "CI/CD Integration",
        "Best Practices",
      ],
      6: [
        "Docker Swarm",
        "Swarm Mode",
        "Services e Tasks",
        "Networking",
        "Load Balancing",
        "Secrets",
        "Configs",
        "Rolling Updates",
        "Health Checks",
        "Monitoring",
      ],
      7: [
        "Kubernetes Basics",
        "Pods e Containers",
        "Services",
        "Deployments",
        "ConfigMaps",
        "Secrets",
        "Ingress",
        "Helm",
        "Monitoring",
        "Troubleshooting",
      ],
      8: [
        "CI/CD Pipeline",
        "GitHub Actions",
        "Jenkins",
        "GitLab CI",
        "Build Automation",
        "Testing",
        "Security Scanning",
        "Deployment",
        "Rollback",
        "Monitoring",
      ],
      9: [
        "Logging Strategies",
        "Monitoring",
        "Metrics",
        "Alerting",
        "Tracing",
        "Debugging",
        "Performance",
        "Security",
        "Compliance",
        "Best Practices",
      ],
      10: [
        "Project Setup",
        "Application Containerization",
        "Database Setup",
        "Networking",
        "Volumes",
        "Environment",
        "Testing",
        "Deployment",
        "Monitoring",
        "Documentation",
      ],
    },
    "react-avancado": {
      1: [
        "useReducer Hook",
        "useContext Hook",
        "Custom Hooks",
        "useCallback Hook",
        "useMemo Hook",
        "useRef Hook",
        "useImperativeHandle",
        "useLayoutEffect",
        "useDebugValue",
        "Hook Rules",
      ],
      2: [
        "Context API",
        "Provider Pattern",
        "Consumer Pattern",
        "Multiple Contexts",
        "Context Performance",
        "State Management",
        "Redux vs Context",
        "Zustand",
        "Jotai",
        "State Patterns",
      ],
      3: [
        "React.memo",
        "useMemo Optimization",
        "useCallback Optimization",
        "Code Splitting",
        "Lazy Loading",
        "Bundle Analysis",
        "Performance Profiling",
        "Virtual Scrolling",
        "Windowing",
        "Memory Leaks",
      ],
      4: [
        "Jest Setup",
        "React Testing Library",
        "Testing Components",
        "Testing Hooks",
        "Testing Context",
        "Mocking",
        "Snapshot Testing",
        "E2E Testing",
        "Test Coverage",
        "CI/CD Testing",
      ],
      5: [
        "Compound Components",
        "Render Props",
        "Higher-Order Components",
        "Custom Hooks Pattern",
        "Provider Pattern",
        "Observer Pattern",
        "Factory Pattern",
        "Architecture Patterns",
        "Code Organization",
        "Best Practices",
      ],
      6: [
        "Next.js Setup",
        "Pages e Routing",
        "Data Fetching",
        "Static Generation",
        "Server-side Rendering",
        "API Routes",
        "Middleware",
        "Performance",
        "Deployment",
        "Best Practices",
      ],
      7: [
        "Service Workers",
        "PWA Manifest",
        "Offline Support",
        "Push Notifications",
        "Background Sync",
        "Caching Strategies",
        "Installation",
        "Updates",
        "Performance",
        "Testing",
      ],
      8: [
        "Apollo Client",
        "GraphQL Queries",
        "Mutations",
        "Subscriptions",
        "Caching",
        "Error Handling",
        "Testing",
        "Performance",
        "Real-time",
        "Best Practices",
      ],
      9: [
        "React Native Setup",
        "Components",
        "Navigation",
        "State Management",
        "APIs",
        "Platform Specific",
        "Testing",
        "Performance",
        "Deployment",
        "Best Practices",
      ],
      10: [
        "Project Setup",
        "Component Library",
        "State Management",
        "Routing",
        "API Integration",
        "Testing",
        "Performance",
        "Deployment",
        "Monitoring",
        "Documentation",
      ],
    },
    "redis-cache": {
      1: [
        "Introdução ao Redis",
        "Instalação",
        "Comandos Básicos",
        "Tipos de Dados",
        "Strings",
        "Lists",
        "Sets",
        "Hashes",
        "Sorted Sets",
        "Redis CLI",
      ],
      2: [
        "Cache Strategies",
        "Cache-Aside",
        "Write-Through",
        "Write-Behind",
        "TTL e Expiration",
        "Cache Invalidation",
        "Cache Warming",
        "Cache Patterns",
        "Distributed Cache",
        "Cache Metrics",
      ],
      3: [
        "Session Storage",
        "Session Management",
        "Session Security",
        "Session Clustering",
        "Session Persistence",
        "Session Analytics",
        "Session Cleanup",
        "Multi-device Sessions",
        "Session Migration",
        "Best Practices",
      ],
      4: [
        "Pub/Sub Basics",
        "Channels",
        "Pattern Matching",
        "Message Persistence",
        "Consumer Groups",
        "Streams",
        "Real-time Features",
        "Notifications",
        "Event Sourcing",
        "Message Queues",
      ],
      5: [
        "Redis Cluster",
        "Sharding",
        "Replication",
        "RDB Persistence",
        "AOF Persistence",
        "Memory Optimization",
        "Performance Tuning",
        "Monitoring",
        "Backup Strategies",
        "High Availability",
      ],
      6: [
        "Node.js Integration",
        "Redis Client",
        "Connection Pooling",
        "Error Handling",
        "Middleware",
        "Caching Middleware",
        "Session Middleware",
        "Rate Limiting",
        "Performance",
        "Best Practices",
      ],
      7: [
        "Python Integration",
        "Redis-py",
        "Django Integration",
        "Flask Integration",
        "Celery",
        "Caching",
        "Session Management",
        "Performance",
        "Testing",
        "Best Practices",
      ],
      8: [
        "Redis CLI",
        "RedisInsight",
        "Monitoring Tools",
        "Performance Analysis",
        "Memory Analysis",
        "Slow Log",
        "Debugging",
        "Troubleshooting",
        "Health Checks",
        "Alerting",
      ],
      9: [
        "Rate Limiting",
        "Leaderboards",
        "Geospatial",
        "HyperLogLog",
        "Bitmaps",
        "Streams",
        "Modules",
        "Lua Scripting",
        "Advanced Patterns",
        "Use Cases",
      ],
      10: [
        "Project Setup",
        "Cache Architecture",
        "Session Management",
        "Real-time Features",
        "Performance",
        "Monitoring",
        "Testing",
        "Deployment",
        "Scaling",
        "Documentation",
      ],
    },
    "css-moderno": {
      1: [
        "Grid Basics",
        "Grid Container",
        "Grid Items",
        "Grid Lines",
        "Grid Areas",
        "Grid Gaps",
        "Grid Alignment",
        "Grid Auto-fit",
        "Grid Responsive",
        "Grid Examples",
      ],
      2: [
        "Flexbox Basics",
        "Flex Container",
        "Flex Items",
        "Flex Direction",
        "Flex Wrap",
        "Justify Content",
        "Align Items",
        "Flex Grow/Shrink",
        "Flex Basis",
        "Flex Examples",
      ],
      3: [
        "CSS Transitions",
        "CSS Animations",
        "Keyframes",
        "Transform Properties",
        "Animation Properties",
        "Timing Functions",
        "Animation Events",
        "Performance",
        "3D Transforms",
        "Animation Libraries",
      ],
      4: [
        "CSS Variables",
        "Custom Properties",
        "CSS Functions",
        "calc() Function",
        "var() Function",
        "Theming",
        "Dynamic Theming",
        "CSS-in-JS",
        "PostCSS",
        "CSS Modules",
      ],
      5: [
        "Media Queries",
        "Breakpoints",
        "Mobile First",
        "Responsive Images",
        "Flexible Grids",
        "Viewport Units",
        "Container Queries",
        "Responsive Typography",
        "Touch Targets",
        "Performance",
      ],
      6: [
        "Styled-components",
        "Emotion",
        "JSS",
        "Aphrodite",
        "CSS-in-JS Benefits",
        "Performance",
        "Testing",
        "Server-side Rendering",
        "Best Practices",
        "Migration",
      ],
      7: [
        "Sass Basics",
        "Variables",
        "Mixins",
        "Functions",
        "Partials",
        "Imports",
        "Nesting",
        "Operators",
        "Control Directives",
        "Best Practices",
      ],
      8: [
        "Critical CSS",
        "CSS Optimization",
        "Minification",
        "Compression",
        "Caching",
        "Preloading",
        "Code Splitting",
        "Tree Shaking",
        "Performance Metrics",
        "Tools",
      ],
      9: [
        "Design Tokens",
        "Component Library",
        "Style Guide",
        "Documentation",
        "Consistency",
        "Maintenance",
        "Versioning",
        "Testing",
        "Automation",
        "Best Practices",
      ],
      10: [
        "Project Setup",
        "Design System",
        "Component Development",
        "Responsive Design",
        "Performance",
        "Testing",
        "Documentation",
        "Deployment",
        "Maintenance",
        "Presentation",
      ],
    },
    "html5-semantica": {
      1: [
        "HTML5 Overview",
        "Semantic Elements",
        "Header Element",
        "Nav Element",
        "Main Element",
        "Section Element",
        "Article Element",
        "Aside Element",
        "Footer Element",
        "Semantic Examples",
      ],
      2: [
        "Accessibility Basics",
        "ARIA Attributes",
        "Screen Readers",
        "Keyboard Navigation",
        "Focus Management",
        "Color Contrast",
        "Alt Text",
        "Form Labels",
        "Error Messages",
        "WCAG Guidelines",
      ],
      3: [
        "Meta Tags",
        "Title Tags",
        "Description Tags",
        "Open Graph",
        "Twitter Cards",
        "Structured Data",
        "Schema.org",
        "Sitemap",
        "Robots.txt",
        "SEO Best Practices",
      ],
      4: [
        "Geolocation API",
        "Web Storage",
        "Local Storage",
        "Session Storage",
        "Web Workers",
        "Service Workers",
        "Push Notifications",
        "Web Sockets",
        "File API",
        "Drag and Drop",
      ],
      5: [
        "Form Validation",
        "Input Types",
        "Form Constraints",
        "Custom Validation",
        "Form Events",
        "Form Submission",
        "File Upload",
        "Form Security",
        "Form Accessibility",
        "Form Best Practices",
      ],
      6: [
        "Canvas Basics",
        "Canvas API",
        "Drawing Shapes",
        "Images",
        "Animations",
        "SVG Basics",
        "SVG vs Canvas",
        "Vector Graphics",
        "Interactive Graphics",
        "Performance",
      ],
      7: [
        "Custom Elements",
        "Shadow DOM",
        "Templates",
        "Web Components",
        "Lifecycle",
        "Properties",
        "Events",
        "Styling",
        "Testing",
        "Browser Support",
      ],
      8: [
        "PWA Manifest",
        "Service Workers",
        "Offline Support",
        "Installation",
        "Push Notifications",
        "Background Sync",
        "Caching",
        "Performance",
        "Testing",
        "Best Practices",
      ],
      9: [
        "Critical Rendering Path",
        "Lazy Loading",
        "Preloading",
        "Resource Hints",
        "Performance Metrics",
        "Optimization",
        "Tools",
        "Monitoring",
        "Best Practices",
        "Case Studies",
      ],
      10: [
        "Project Setup",
        "Semantic Structure",
        "Accessibility",
        "SEO",
        "Performance",
        "PWA Features",
        "Testing",
        "Deployment",
        "Monitoring",
        "Documentation",
      ],
    },
    "git-github": {
      1: [
        "Git Basics",
        "Repository Setup",
        "First Commit",
        "Git Status",
        "Git Log",
        "Git Diff",
        "Git Add",
        "Git Commit",
        "Git Reset",
        "Git Checkout",
      ],
      2: [
        "GitHub Account",
        "Repository Creation",
        "Clone Repository",
        "Push and Pull",
        "Fork Repository",
        "Pull Requests",
        "Issues",
        "GitHub Pages",
        "GitHub Actions",
        "Collaboration",
      ],
      3: [
        "Branching Strategy",
        "Feature Branches",
        "Git Flow",
        "GitHub Flow",
        "Branch Protection",
        "Merge Strategies",
        "Rebase",
        "Cherry Pick",
        "Branch Management",
        "Release Management",
      ],
      4: [
        "CI/CD Concepts",
        "GitHub Actions",
        "Workflows",
        "Automated Testing",
        "Deployment",
        "Environment Variables",
        "Secrets",
        "Artifacts",
        "Matrix Strategy",
        "Self-hosted Runners",
      ],
      5: [
        "Commit Messages",
        "Code Review",
        "Pull Request Templates",
        "Issue Templates",
        "Documentation",
        "Changelog",
        "Versioning",
        "Troubleshooting",
        "Git Hooks",
        "Best Practices",
      ],
      6: [
        "Git Rebase",
        "Interactive Rebase",
        "Cherry Pick",
        "Git Hooks",
        "Pre-commit Hooks",
        "Post-commit Hooks",
        "Server Hooks",
        "Custom Hooks",
        "Hook Management",
        "Best Practices",
      ],
      7: [
        "VS Code Integration",
        "IntelliJ Integration",
        "Git GUI Tools",
        "Command Line",
        "Git Aliases",
        "Git Configuration",
        "SSH Keys",
        "Authentication",
        "Troubleshooting",
        "Best Practices",
      ],
      8: [
        "Git LFS",
        "Large Files",
        "Submodules",
        "Submodule Management",
        "Nested Repositories",
        "Dependencies",
        "Versioning",
        "Updates",
        "Troubleshooting",
        "Best Practices",
      ],
      9: [
        "SSH Keys",
        "GPG Signing",
        "Branch Protection",
        "Repository Settings",
        "Team Management",
        "Permissions",
        "Security",
        "Audit Logs",
        "Compliance",
        "Best Practices",
      ],
      10: [
        "Project Setup",
        "Repository Structure",
        "Branching Strategy",
        "CI/CD Pipeline",
        "Code Review",
        "Documentation",
        "Release Process",
        "Monitoring",
        "Maintenance",
        "Best Practices",
      ],
    },
    "postgresql-avancado": {
      1: [
        "Advanced Joins",
        "Subqueries",
        "Window Functions",
        "Common Table Expressions",
        "Recursive Queries",
        "Set Operations",
        "Aggregate Functions",
        "Grouping Sets",
        "Pivot Tables",
        "Query Optimization",
      ],
      2: [
        "Index Types",
        "B-tree Indexes",
        "Hash Indexes",
        "GIN Indexes",
        "GiST Indexes",
        "Partial Indexes",
        "Expression Indexes",
        "Index Maintenance",
        "Query Planning",
        "Performance Tuning",
      ],
      3: [
        "ACID Properties",
        "Transaction Isolation",
        "Lock Types",
        "Deadlocks",
        "Concurrency Control",
        "MVCC",
        "Vacuum",
        "Autovacuum",
        "Transaction Logging",
        "Recovery",
      ],
      4: [
        "PL/pgSQL Basics",
        "Functions",
        "Procedures",
        "Triggers",
        "Views",
        "Materialized Views",
        "Rules",
        "Extensions",
        "Custom Types",
        "Advanced Features",
      ],
      5: [
        "Backup Strategies",
        "pg_dump",
        "pg_restore",
        "WAL Archiving",
        "Point-in-time Recovery",
        "Replication",
        "Streaming Replication",
        "Logical Replication",
        "Monitoring",
        "Maintenance",
      ],
      6: [
        "Replication Setup",
        "Streaming Replication",
        "Logical Replication",
        "Replication Slots",
        "Failover",
        "Load Balancing",
        "Read Replicas",
        "Monitoring",
        "Troubleshooting",
        "Best Practices",
      ],
      7: [
        "PostGIS",
        "Spatial Data",
        "Geographic Queries",
        "Extensions",
        "Custom Extensions",
        "Foreign Data Wrappers",
        "Partitioning",
        "Advanced Features",
        "Performance",
        "Use Cases",
      ],
      8: [
        "pg_stat",
        "Query Analysis",
        "Performance Monitoring",
        "Slow Queries",
        "Index Usage",
        "Table Statistics",
        "Connection Monitoring",
        "Alerting",
        "Troubleshooting",
        "Optimization",
      ],
      9: [
        "Roles",
        "Grants",
        "Row-level Security",
        "Column-level Security",
        "Audit Logging",
        "Encryption",
        "SSL",
        "Network Security",
        "Compliance",
        "Best Practices",
      ],
      10: [
        "Project Setup",
        "Database Design",
        "Schema Design",
        "Performance",
        "Security",
        "Backup",
        "Monitoring",
        "Maintenance",
        "Documentation",
        "Best Practices",
      ],
    },
  };

  return (
    titles[courseSlug as keyof typeof titles]?.[
      moduleNumber as keyof (typeof titles)[keyof typeof titles]
    ]?.[lessonNumber - 1] || `Aula ${lessonNumber}`
  );
}

function getLessonDescription(
  courseSlug: string,
  moduleNumber: number,
  lessonNumber: number
): string {
  return `Conteúdo detalhado da aula ${lessonNumber} do módulo ${moduleNumber} do curso ${courseSlug}`;
}

function getQuestionData(
  courseSlug: string,
  moduleNumber: number,
  questionNumber: number
) {
  const questionTemplates = {
    "nodejs-completo": {
      title: `Pergunta ${questionNumber} sobre Node.js`,
      type: "MULTIPLE_CHOICE" as const,
      explanation: "Explicação sobre Node.js",
      points: 2,
      order: questionNumber,
      options: ["Opção A", "Opção B", "Opção C", "Opção D"],
      correctAnswers: [1],
    },
    "docker-containerizacao": {
      title: `Pergunta ${questionNumber} sobre Docker`,
      type: "MULTIPLE_CHOICE" as const,
      explanation: "Explicação sobre Docker",
      points: 2,
      order: questionNumber,
      options: ["Opção A", "Opção B", "Opção C", "Opção D"],
      correctAnswers: [1],
    },
    "react-avancado": {
      title: `Pergunta ${questionNumber} sobre React`,
      type: "MULTIPLE_CHOICE" as const,
      explanation: "Explicação sobre React",
      points: 2,
      order: questionNumber,
      options: ["Opção A", "Opção B", "Opção C", "Opção D"],
      correctAnswers: [1],
    },
    "redis-cache": {
      title: `Pergunta ${questionNumber} sobre Redis`,
      type: "MULTIPLE_CHOICE" as const,
      explanation: "Explicação sobre Redis",
      points: 2,
      order: questionNumber,
      options: ["Opção A", "Opção B", "Opção C", "Opção D"],
      correctAnswers: [1],
    },
    "css-moderno": {
      title: `Pergunta ${questionNumber} sobre CSS`,
      type: "MULTIPLE_CHOICE" as const,
      explanation: "Explicação sobre CSS",
      points: 2,
      order: questionNumber,
      options: ["Opção A", "Opção B", "Opção C", "Opção D"],
      correctAnswers: [1],
    },
    "html5-semantica": {
      title: `Pergunta ${questionNumber} sobre HTML5`,
      type: "MULTIPLE_CHOICE" as const,
      explanation: "Explicação sobre HTML5",
      points: 2,
      order: questionNumber,
      options: ["Opção A", "Opção B", "Opção C", "Opção D"],
      correctAnswers: [1],
    },
    "git-github": {
      title: `Pergunta ${questionNumber} sobre Git`,
      type: "MULTIPLE_CHOICE" as const,
      explanation: "Explicação sobre Git",
      points: 2,
      order: questionNumber,
      options: ["Opção A", "Opção B", "Opção C", "Opção D"],
      correctAnswers: [1],
    },
    "postgresql-avancado": {
      title: `Pergunta ${questionNumber} sobre PostgreSQL`,
      type: "MULTIPLE_CHOICE" as const,
      explanation: "Explicação sobre PostgreSQL",
      points: 2,
      order: questionNumber,
      options: ["Opção A", "Opção B", "Opção C", "Opção D"],
      correctAnswers: [1],
    },
  };

  return (
    questionTemplates[courseSlug as keyof typeof questionTemplates] || {
      title: `Pergunta ${questionNumber}`,
      type: "MULTIPLE_CHOICE" as const,
      explanation: "Explicação da resposta",
      points: 2,
      order: questionNumber,
      options: ["Opção A", "Opção B", "Opção C", "Opção D"],
      correctAnswers: [1],
    }
  );
}

// Função principal que executa todos os seeds
async function main() {
  try {
    console.log("🚀 Iniciando seed do banco de dados...\n");

    // 1. Dados fundamentais (categorias, badges, desafios, etc.)
    const foundationData = await seedFoundationData();
    console.log("✅ Dados fundamentais criados\n");

    // 2. Cursos específicos
    const coursesData = await seedCoursesAndContent(foundationData);
    console.log("✅ Cursos específicos criados\n");

    // 3. Estrutura completa dos cursos (módulos, aulas, quizzes)
    const courseStructure = await seedCourseStructure(coursesData);
    console.log("✅ Estrutura completa dos cursos criada\n");

    console.log("🎉 Seed concluído com sucesso!");
    console.log("\n📊 Resumo dos dados criados:");
    console.log(`- ${foundationData.categories.length} categorias`);
    console.log(`- ${foundationData.subcategories.length} subcategorias`);
    console.log(`- ${foundationData.badges.length} badges`);
    console.log(`- ${foundationData.challenges.length} desafios diários`);
    console.log(`- ${foundationData.levelRewards.length} recompensas de nível`);
    console.log(`- ${coursesData.courses.length} cursos específicos`);
    console.log(`- ${courseStructure.modules.length} módulos`);
    console.log(`- ${courseStructure.lessons.length} aulas`);
    console.log(`- ${courseStructure.quizzes.length} quizzes`);
    console.log(`- ${courseStructure.questions.length} questões`);
  } catch (error) {
    console.error("❌ Erro durante o seed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o seed
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
