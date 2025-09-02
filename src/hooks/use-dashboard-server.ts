"use client";

import { DashboardData, getDashboardData } from "@/actions/dashboard";
import { useCallback, useEffect, useState } from "react";

interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
}

export function useDashboardServer() {
  const [stats, setStats] = useState<DashboardData["stats"] | null>(null);
  const [recentActivity, setRecentActivity] = useState<
    DashboardData["recentActivity"]
  >([]);
  const [topCourses, setTopCourses] = useState<DashboardData["topCourses"]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<
    DashboardData["performanceMetrics"] | null
  >(null);
  const [tableData, setTableData] = useState<DashboardData["tableData"]>([]);
  const [additionalMetrics, setAdditionalMetrics] = useState<
    DashboardData["additionalMetrics"] | null
  >(null);
  const [chartData, setChartData] = useState<DashboardData["chartData"] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getDashboardData();

      setStats(data.stats);
      setRecentActivity(data.recentActivity);
      setTopCourses(data.topCourses);
      setPerformanceMetrics(data.performanceMetrics);
      setTableData(data.tableData);
      setAdditionalMetrics(data.additionalMetrics);
      setChartData(data.chartData);

      addToast(
        "success",
        "Dados atualizados",
        "Dashboard atualizado com sucesso!"
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar dados";
      setError(errorMessage);
      addToast("error", "Erro", errorMessage);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshData = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const exportReport = useCallback(() => {
    try {
      // Simular exportação de relatório
      const reportData = {
        stats,
        performanceMetrics,
        topCourses,
        additionalMetrics,
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dashboard-report-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addToast(
        "success",
        "Relatório exportado",
        "Relatório baixado com sucesso!"
      );
    } catch (err) {
      console.error("Erro ao exportar relatório:", err);
      addToast("error", "Erro na exportação", "Erro ao exportar relatório");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats, performanceMetrics, topCourses, additionalMetrics]);

  const addToast = useCallback(
    (type: Toast["type"], title: string, message: string) => {
      const newToast: Toast = {
        id: Date.now().toString(),
        type,
        title,
        message,
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto-remover toast após 5 segundos
      setTimeout(() => {
        removeToast(newToast.id);
      }, 5000);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats: stats || {
      totalUsers: 0,
      activeUsers: 0,
      monthlyGrowth: 0,
      completedCourses: 0,
      totalCourses: 0,
      totalRevenue: 0,
      averageRating: 0,
      satisfactionRate: 0,
    },
    recentActivity,
    topCourses,
    performanceMetrics: performanceMetrics || {
      courseCompletion: 0,
      mentorSatisfaction: 0,
      userEngagement: 0,
      contentQuality: 0,
      platformUptime: 0,
    },
    tableData,
    additionalMetrics: additionalMetrics || {
      totalRevenue: 0,
      newCustomers: 0,
      activeAccounts: 0,
      growthRate: 0,
    },
    chartData: chartData || {
      labels: [],
      datasets: [],
    },
    isLoading,
    error,
    toasts,
    refreshData,
    exportReport,
    removeToast,
  };
}
