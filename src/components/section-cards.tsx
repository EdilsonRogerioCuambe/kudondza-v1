"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconTrendingUp, IconTrendingDown, IconMinus } from "@tabler/icons-react";

interface SectionCardsProps {
  totalRevenue: number;
  newCustomers: number;
  activeAccounts: number;
  growthRate: number;
}

export function SectionCards({
  totalRevenue,
  newCustomers,
  activeAccounts,
  growthRate,
}: SectionCardsProps) {
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

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {/* Receita Total */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Receita Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="flex items-center gap-1 mt-1">
            {getGrowthIcon(growthRate)}
            <span
              className={`text-sm font-medium ${getGrowthColor(growthRate)}`}
            >
              {growthRate > 0 ? "+" : ""}
              {growthRate.toFixed(1)}%
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400">
              este mês
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Novos Clientes */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
            Novos Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            {newCustomers.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <IconTrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-600">
              +{Math.min(growthRate, 25).toFixed(1)}%
            </span>
            <span className="text-xs text-green-600 dark:text-green-400">
              crescimento
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Contas Ativas */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
            Contas Ativas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {activeAccounts.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <IconTrendingUp className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-600">
              +{Math.min(growthRate * 0.8, 20).toFixed(1)}%
            </span>
            <span className="text-xs text-purple-600 dark:text-purple-400">
              engajamento
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Taxa de Crescimento */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
            Taxa de Crescimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
            {growthRate.toFixed(1)}%
          </div>
          <div className="flex items-center gap-1 mt-1">
            {getGrowthIcon(growthRate)}
            <span
              className={`text-sm font-medium ${getGrowthColor(growthRate)}`}
            >
              {growthRate > 0 ? "Crescimento" : "Declínio"}
            </span>
            <span className="text-xs text-orange-600 dark:text-orange-400">
              mensal
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
