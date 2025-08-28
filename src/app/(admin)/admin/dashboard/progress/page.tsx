import {
  getCommunityRanking,
  getUserAchievements,
  getUserGoals,
  getUserProgress,
} from "@/actions/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  IconAward,
  IconBook,
  IconCalendar,
  IconCheck,
  IconClock,
  IconRefresh,
  IconStar,
  IconTarget,
  IconTrendingUp,
  IconTrophy,
  IconUsers,
} from "@tabler/icons-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
  rarity: string;
  xpReward: number;
  color: string;
}

interface WeeklyStat {
  day: string;
  hours: number;
  goal: number;
}

interface RecentCourse {
  name: string;
  progress: number;
  status: string;
  lastAccessed: string;
}

export default async function ProgressoPage() {
  // Buscar dados reais do banco de dados
  const [progressData, achievements, communityRanking, userGoals] =
    await Promise.all([
      getUserProgress(),
      getUserAchievements(),
      getCommunityRanking(),
      getUserGoals(),
    ]);

  // Dados de conquistas para exibição
  const displayAchievements = achievements
    .slice(0, 4)
    .map((achievement: Achievement) => ({
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon,
      earned: achievement.earned,
    }));

  // Estatísticas semanais
  const weeklyStats =
    progressData.weeklyStats.length > 0
      ? progressData.weeklyStats
      : [
          { day: "Seg", hours: 0, goal: 3 },
          { day: "Ter", hours: 0, goal: 3 },
          { day: "Qua", hours: 0, goal: 3 },
          { day: "Qui", hours: 0, goal: 3 },
          { day: "Sex", hours: 0, goal: 3 },
          { day: "Sáb", hours: 0, goal: 3 },
          { day: "Dom", hours: 0, goal: 3 },
        ];

  // Calcular tempo total da semana
  const weeklyTotalHours = weeklyStats.reduce(
    (acc: number, day: WeeklyStat) => acc + day.hours,
    0
  );

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meu Progresso</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe seu desenvolvimento e conquistas
          </p>
        </div>
        <Button variant="outline" size="sm">
          <IconRefresh className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Cards de Estatísticas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Progresso Geral
            </CardTitle>
            <IconTrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {progressData.overallProgress}%
            </div>
            <Progress value={progressData.overallProgress} className="mt-2" />
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {progressData.coursesCompleted} de {progressData.totalCourses}{" "}
              cursos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Sequência Atual
            </CardTitle>
            <IconTarget className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {progressData.currentStreak} dias
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              Mantenha a sequência!
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Tempo de Estudo
            </CardTitle>
            <IconClock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {progressData.totalStudyTime}h
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              Total acumulado
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
              Conquistas
            </CardTitle>
            <IconTrophy className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {progressData.achievements}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              Desbloqueadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Seção Principal - 2 Colunas */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Cursos Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBook className="h-5 w-5" />
              Cursos Recentes
            </CardTitle>
            <CardDescription>
              Seu progresso nos cursos mais recentes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {progressData.recentCourses.length > 0 ? (
              progressData.recentCourses.map(
                (course: RecentCourse, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{course.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={
                              course.status === "Concluído"
                                ? "default"
                                : course.status === "Em andamento"
                                ? "secondary"
                                : "outline"
                            }
                            className="text-xs"
                          >
                            {course.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {course.lastAccessed}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {course.progress}%
                        </div>
                      </div>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    {index < progressData.recentCourses.length - 1 && (
                      <Separator />
                    )}
                  </div>
                )
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <IconBook className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum curso encontrado</p>
                <p className="text-sm">
                  Comece a estudar para ver seu progresso aqui
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conquistas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconAward className="h-5 w-5" />
              Conquistas
            </CardTitle>
            <CardDescription>
              Desbloqueie novas conquistas continuando seus estudos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {displayAchievements.length > 0 ? (
              displayAchievements.map(
                (
                  achievement: {
                    name: string;
                    description: string;
                    icon: string;
                    earned: boolean;
                  },
                  index: number
                ) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    <div
                      className={`text-2xl ${
                        achievement.earned ? "opacity-100" : "opacity-30"
                      }`}
                    >
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-medium text-sm ${
                          achievement.earned ? "" : "text-muted-foreground"
                        }`}
                      >
                        {achievement.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <IconCheck className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                )
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <IconAward className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma conquista disponível</p>
                <p className="text-sm">
                  Continue estudando para desbloquear conquistas
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas Semanais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconCalendar className="h-5 w-5" />
            Estatísticas da Semana
          </CardTitle>
          <CardDescription>
            Seu tempo de estudo diário vs. meta semanal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weeklyStats.map((stat: WeeklyStat, index: number) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-xs font-medium text-muted-foreground">
                  {stat.day}
                </div>
                <div className="relative h-20 bg-muted rounded-lg flex items-end justify-center p-1">
                  <div
                    className="bg-primary rounded-sm w-full transition-all duration-300"
                    style={{
                      height: `${Math.min(
                        (stat.hours / stat.goal) * 100,
                        100
                      )}%`,
                      backgroundColor:
                        stat.hours >= stat.goal
                          ? "hsl(var(--primary))"
                          : "hsl(var(--muted-foreground))",
                    }}
                  />
                </div>
                <div className="text-xs">
                  <div className="font-medium">{stat.hours}h</div>
                  <div className="text-muted-foreground">
                    meta: {stat.goal}h
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metas e Objetivos */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconTarget className="h-5 w-5" />
              Meta Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tempo de estudo</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(weeklyTotalHours)}h / {progressData.weeklyGoal}h
                </span>
              </div>
              <Progress
                value={(weeklyTotalHours / progressData.weeklyGoal) * 100}
                className="h-3"
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconStar className="h-4 w-4" />
                <span>Continue assim! Você está no caminho certo.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUsers className="h-5 w-5" />
              Ranking da Comunidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                    #{communityRanking.userRank || "N/A"}
                  </div>
                  <div>
                    <div className="font-medium">Sua posição</div>
                    <div className="text-sm text-muted-foreground">
                      Entre {communityRanking.totalUsers} estudantes
                    </div>
                  </div>
                </div>
                <Badge variant="secondary">
                  Top {communityRanking.topPercentage}%
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Próximo nível:</span>
                  <span>{communityRanking.nextLevelPoints} pontos</span>
                </div>
                <div className="flex justify-between">
                  <span>Seus pontos:</span>
                  <span>{communityRanking.userPoints} pontos</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
