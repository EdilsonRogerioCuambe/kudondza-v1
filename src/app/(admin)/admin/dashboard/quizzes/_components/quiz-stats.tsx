"use client";

import { Brain, Target, Users, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuizStats } from "./types";

interface QuizStatsProps {
  stats: QuizStats;
}

export default function QuizStats({ stats }: QuizStatsProps) {
  const statCards = [
    {
      title: "Total de Quizzes",
      value: stats.totalQuizzes,
      icon: Brain,
      description: "Quizzes criados",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total de Questões",
      value: stats.totalQuestions,
      icon: Target,
      description: "Questões disponíveis",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total de Tentativas",
      value: stats.totalAttempts,
      icon: Users,
      description: "Tentativas dos alunos",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Pontuação Média",
      value: `${stats.averageScore.toFixed(1)}%`,
      icon: Trophy,
      description: "Média geral",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
