"use client";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardSkeleton } from "@/components/ui/dashboard-skeleton";
import { ToastContainer } from "@/components/ui/dashboard-toast";
import { useDashboardServer } from "@/hooks/use-dashboard-server";
import {
  IconActivity,
  IconAlertCircle,
  IconAward,
  IconBook,
  IconBrain,
  IconCode,
  IconDownload,
  IconDownload as IconDownloadFile,
  IconEye,
  IconMessage,
  IconMinus,
  IconPalette,
  IconRefresh,
  IconRocket,
  IconSettings,
  IconStar,
  IconTarget,
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";

export default function DashboardPage() {
  const {
    stats,
    recentActivity,
    topCourses,
    performanceMetrics,
    tableData,
    additionalMetrics,
    chartData,
    isLoading,
    error,
    toasts,
    refreshData,
    exportReport,
    removeToast,
  } = useDashboardServer();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "course_completion":
        return <IconBook className="h-4 w-4 text-green-500" />;
      case "mentorship":
        return <IconMessage className="h-4 w-4 text-blue-500" />;
      case "resource_download":
        return <IconDownload className="h-4 w-4 text-purple-500" />;
      case "certificate":
        return <IconAward className="h-4 w-4 text-yellow-500" />;
      case "ai_assistant":
        return <IconBrain className="h-4 w-4 text-indigo-500" />;
      default:
        return <IconActivity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Frontend":
        return <IconCode className="h-4 w-4" />;
      case "Backend":
        return <IconSettings className="h-4 w-4" />;
      case "Design":
        return <IconPalette className="h-4 w-4" />;
      case "AI/ML":
        return <IconBrain className="h-4 w-4" />;
      case "DevOps":
        return <IconRocket className="h-4 w-4" />;
      default:
        return <IconTarget className="h-4 w-4" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) {
      return <IconTrendingUp className="h-4 w-4 text-green-500" />;
    } else if (growth < 0) {
      return <IconTrendingDown className="h-4 w-4 text-red-500" />;
    } else {
      return <IconMinus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) {
      return "text-green-600";
    } else if (growth < 0) {
      return "text-red-600";
    } else {
      return "text-gray-600";
    }
  };

  // Mostrar skeleton durante carregamento
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Mostrar erro se houver
  if (error) {
    return (
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <Alert variant="destructive">
          <IconAlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={refreshData} variant="outline">
          <IconRefresh className="h-4 w-4 mr-2" />
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Dashboard
            </h2>
            <p className="text-muted-foreground">
              Visão geral da plataforma e métricas de performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={isLoading}
            >
              <IconRefresh
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? "Atualizando..." : "Atualizar"}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={exportReport}
              disabled={isLoading}
            >
              <IconDownloadFile className="h-4 w-4 mr-2" />
              Exportar Relatório
            </Button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Usuários
              </CardTitle>
              <IconUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalUsers.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {getGrowthIcon(stats.monthlyGrowth)}
                <span
                  className={`text-sm font-medium ${getGrowthColor(
                    stats.monthlyGrowth
                  )}`}
                >
                  {stats.monthlyGrowth > 0 ? "+" : ""}
                  {stats.monthlyGrowth.toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground">este mês</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats.activeUsers.toLocaleString()} ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cursos Completados
              </CardTitle>
              <IconBook className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.completedCourses.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <IconTrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">
                  +{performanceMetrics.courseCompletion.toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground">
                  taxa de conclusão
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats.totalCourses} cursos disponíveis
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Receita Total
              </CardTitle>
              <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalRevenue)}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {getGrowthIcon(additionalMetrics.growthRate)}
                <span
                  className={`text-sm font-medium ${getGrowthColor(
                    additionalMetrics.growthRate
                  )}`}
                >
                  {additionalMetrics.growthRate > 0 ? "+" : ""}
                  {additionalMetrics.growthRate.toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground">este mês</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Média de{" "}
                {formatCurrency(
                  stats.totalRevenue / Math.max(stats.totalUsers, 1)
                )}{" "}
                por usuário
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
              <IconStar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <IconTrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">
                  +{performanceMetrics.mentorSatisfaction.toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground">
                  satisfação
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats.satisfactionRate.toFixed(1)}% taxa de satisfação
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos e Análises */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Gráfico Principal */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Performance da Plataforma</CardTitle>
              <CardDescription>
                Métricas de engajamento e crescimento dos últimos 30 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive data={chartData} />
              </div>
            </CardContent>
          </Card>

          {/* Atividade Recente */}
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>Últimas ações dos usuários</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {activity.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {activity.user}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {activity.action}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getActivityIcon(activity.type)}
                        <span className="text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      Nenhuma atividade recente
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cursos em Destaque */}
        <Card>
          <CardHeader>
            <CardTitle>Cursos em Destaque</CardTitle>
            <CardDescription>
              Os cursos mais populares e bem avaliados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {topCourses.length > 0 ? (
                topCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="group hover:shadow-lg transition-all duration-300"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(course.category)}
                          <Badge variant="outline" className="text-xs">
                            {course.category}
                          </Badge>
                        </div>
                        {course.isTrending && (
                          <Badge
                            variant="default"
                            className="text-xs bg-orange-100 text-orange-800"
                          >
                            Trending
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-1">
                          {course.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          por {course.instructor}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold">
                            {course.students.toLocaleString()}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            Estudantes
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold flex items-center justify-center gap-1">
                            <IconStar className="h-3 w-3 text-yellow-500" />
                            {course.rating.toFixed(1)}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            Avaliação
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="font-semibold text-green-600">
                          {formatCurrency(course.revenue)}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          Receita
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="w-full">
                        <IconEye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">
                    Nenhum curso em destaque encontrado
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Métricas de Performance */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Performance</CardTitle>
              <CardDescription>
                Indicadores de qualidade e engajamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(performanceMetrics).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted/50 rounded-lg flex items-center justify-center">
                        <IconTarget className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm capitalize">
                          {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{value.toFixed(1)}%</div>
                      <div className="w-24 bg-muted rounded-full h-2 mt-1">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tabela de Dados */}
          <Card>
            <CardHeader>
              <CardTitle>Dados Recentes</CardTitle>
              <CardDescription>
                Informações detalhadas da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable data={tableData} />
            </CardContent>
          </Card>
        </div>

        {/* Seção de Cards */}
        <SectionCards
          totalRevenue={additionalMetrics.totalRevenue}
          newCustomers={additionalMetrics.newCustomers}
          activeAccounts={additionalMetrics.activeAccounts}
          growthRate={additionalMetrics.growthRate}
        />
    </div>

      {/* Sistema de Notificações */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}
