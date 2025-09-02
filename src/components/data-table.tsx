"use client";

import { TableData } from "@/actions/dashboard";
import { Badge } from "@/components/ui/badge";

interface DataTableProps {
  data: TableData[];
}

export function DataTable({ data }: DataTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum dado disponível</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      case "neutral":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="bg-muted/50 px-4 py-2 border-b">
          <h4 className="font-medium text-sm">Métricas da Plataforma</h4>
        </div>
        <div className="divide-y">
          {data.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm">{item.value}</span>
                <Badge
                  variant="secondary"
                  className={`text-xs ${getStatusColor(item.status)}`}
                >
                  {item.change}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Resumo estatístico */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {data.filter(item => item.status === "positive").length}
          </div>
          <div className="text-xs text-muted-foreground">Métricas Positivas</div>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {data.length}
          </div>
          <div className="text-xs text-muted-foreground">Total de Métricas</div>
        </div>
      </div>
    </div>
  );
}
