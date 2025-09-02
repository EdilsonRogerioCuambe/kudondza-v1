"use server";

import prisma from "@/lib/prisma";

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  monthlyGrowth: number;
  completedCourses: number;
  totalCourses: number;
  totalRevenue: number;
  averageRating: number;
  satisfactionRate: number;
}

export interface PerformanceMetrics {
  courseCompletion: number;
  mentorSatisfaction: number;
  userEngagement: number;
  contentQuality: number;
  platformUptime: number;
}

export interface RecentActivity {
  id: string;
  user: string;
  action: string;
  type: string;
  avatar: string;
  time: string;
}

export interface TopCourse {
  id: string;
  title: string;
  instructor: string;
  category: string;
  students: number;
  rating: number;
  revenue: number;
  isTrending: boolean;
}

export interface AdditionalMetrics {
  totalRevenue: number;
  newCustomers: number;
  activeAccounts: number;
  growthRate: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

export interface TableData {
  id: string;
  name: string;
  value: string;
  change: string;
  status: string;
}

export interface DashboardData {
  stats: DashboardStats;
  performanceMetrics: PerformanceMetrics;
  recentActivity: RecentActivity[];
  topCourses: TopCourse[];
  additionalMetrics: AdditionalMetrics;
  chartData: ChartData;
  tableData: TableData[];
}

/**
 * Busca todos os dados necessários para o dashboard
 */
export async function getDashboardData(): Promise<DashboardData> {
  try {
    // Buscar estatísticas básicas
    const [
      totalUsers,
      activeUsers,
      totalCourses,
      completedCourses,
      totalRevenue,
      averageRating,
      satisfactionRate,
      monthlyGrowth,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isOnline: true } }),
      prisma.course.count({ where: { status: "PUBLISHED" } }),
      prisma.progress.count({ where: { completed: true } }),
      prisma.course.aggregate({
        _sum: { price: true },
        where: { status: "PUBLISHED" },
      }),
      prisma.review.aggregate({
        _avg: { rating: true },
      }),
      prisma.review.count({ where: { rating: { gte: 4 } } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30)),
          },
        },
      }),
    ]);

    // Calcular métricas de performance
    const performanceMetrics: PerformanceMetrics = {
      courseCompletion:
        totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0,
      mentorSatisfaction:
        satisfactionRate > 0 ? (satisfactionRate / totalUsers) * 100 : 0,
      userEngagement: 85.2, // Valor mockado para demonstração
      contentQuality: 92.1, // Valor mockado para demonstração
      platformUptime: 99.8, // Valor mockado para demonstração
    };

    // Buscar atividade recente
    const recentActivity = await prisma.userActivity.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    // Buscar cursos em destaque
    const topCourses = await prisma.course.findMany({
      where: { status: "PUBLISHED" },
      take: 8,
      orderBy: { viewCount: "desc" },
      include: {
        instructor: {
          select: { name: true },
        },
        category: {
          select: { name: true },
        },
        reviews: {
          select: { rating: true },
        },
        enrollments: {
          select: { id: true },
        },
      },
    });

    // Preparar dados dos cursos
    const formattedTopCourses: TopCourse[] = topCourses.map((course) => ({
      id: course.id,
      title: course.title,
      instructor: course.instructor.name,
      category: course.category.name,
      students: course.enrollments.length,
      rating:
        course.reviews.length > 0
          ? course.reviews.reduce((acc, review) => acc + review.rating, 0) /
            course.reviews.length
          : 0,
      revenue: Number(course.price ?? 0) * course.enrollments.length,
      isTrending: Math.random() > 0.7, // Mock para demonstração
    }));

    // Calcular métricas adicionais
    const additionalMetrics: AdditionalMetrics = {
      totalRevenue: Number(totalRevenue._sum.price ?? 0),
      newCustomers: monthlyGrowth,
      activeAccounts: activeUsers,
      growthRate: totalUsers > 0 ? (monthlyGrowth / totalUsers) * 100 : 0,
    };

    // Preparar dados do gráfico
    const chartData: ChartData = {
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
      datasets: [
        {
          label: "Usuários Ativos",
          data: [1200, 1350, 1420, 1580, 1650, 1800],
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
        },
        {
          label: "Cursos Completados",
          data: [45, 52, 48, 61, 58, 67],
          borderColor: "rgb(34, 197, 94)",
          backgroundColor: "rgba(34, 197, 94, 0.1)",
        },
      ],
    };

    // Preparar dados da tabela
    const tableData: TableData[] = [
      {
        id: "1",
        name: "Novos Usuários",
        value: monthlyGrowth.toString(),
        change: "+12%",
        status: "positive",
      },
      {
        id: "2",
        name: "Cursos Ativos",
        value: totalCourses.toString(),
        change: "+5%",
        status: "positive",
      },
      {
        id: "3",
        name: "Receita Mensal",
        value: `R$ ${(totalRevenue._sum.price || 0).toLocaleString()}`,
        change: "+8%",
        status: "positive",
      },
      {
        id: "4",
        name: "Taxa de Engajamento",
        value: "85.2%",
        change: "+2%",
        status: "positive",
      },
    ];

    // Formatar atividade recente
    const formattedRecentActivity: RecentActivity[] = recentActivity.map(
      (activity) => ({
        id: activity.id,
        user: activity.user.name,
        action: activity.action || "Atividade realizada",
        type: activity.type || "general",
        avatar: activity.user.image || "U",
        time: formatTimeAgo(activity.createdAt),
      })
    );

    return {
      stats: {
        totalUsers,
        activeUsers,
        monthlyGrowth,
        completedCourses,
        totalCourses,
        totalRevenue: Number(totalRevenue._sum.price ?? 0),
        averageRating: averageRating._avg.rating || 0,
        satisfactionRate:
          totalUsers > 0 ? (satisfactionRate / totalUsers) * 100 : 0,
      },
      performanceMetrics,
      recentActivity: formattedRecentActivity,
      topCourses: formattedTopCourses,
      additionalMetrics,
      chartData,
      tableData,
    };
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    // Fallback seguro quando o banco estiver indisponível
    const empty: DashboardData = {
      stats: {
        totalUsers: 0,
        activeUsers: 0,
        monthlyGrowth: 0,
        completedCourses: 0,
        totalCourses: 0,
        totalRevenue: 0,
        averageRating: 0,
        satisfactionRate: 0,
      },
      performanceMetrics: {
        courseCompletion: 0,
        mentorSatisfaction: 0,
        userEngagement: 0,
        contentQuality: 0,
        platformUptime: 0,
      },
      recentActivity: [],
      topCourses: [],
      additionalMetrics: {
        totalRevenue: 0,
        newCustomers: 0,
        activeAccounts: 0,
        growthRate: 0,
      },
      chartData: { labels: [], datasets: [] },
      tableData: [],
    };
    return empty;
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "agora";
  if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h atrás`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d atrás`;

  return date.toLocaleDateString("pt-BR");
}
