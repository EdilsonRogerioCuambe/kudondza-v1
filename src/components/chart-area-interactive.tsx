"use client";

import { ChartData } from "@/actions/dashboard";

interface ChartAreaInteractiveProps {
  data: ChartData;
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  // Componente mockado para demonstração
  // Em produção, você pode usar bibliotecas como Chart.js, Recharts, ou Victory
  
  if (!data || data.labels.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>Nenhum dado disponível para o gráfico</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      {/* Simulação de gráfico de área */}
      <div className="relative w-full h-full">
        {/* Eixo Y */}
        <div className="absolute left-0 top-0 bottom-0 w-12 border-r border-border">
          {[100, 75, 50, 25, 0].map((value) => (
            <div
              key={value}
              className="absolute text-xs text-muted-foreground"
              style={{ top: `${100 - value}%` }}
            >
              {value}
            </div>
          ))}
        </div>
        
        {/* Eixo X */}
        <div className="absolute left-12 right-0 bottom-0 h-8 border-t border-border">
          <div className="flex justify-between px-2">
            {data.labels.map((label) => (
              <span key={label} className="text-xs text-muted-foreground">
                {label}
              </span>
            ))}
          </div>
        </div>
        
        {/* Área do gráfico */}
        <div className="absolute left-12 right-0 top-0 bottom-8">
          {/* Linha de dados 1 */}
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
              </linearGradient>
            </defs>
            <path
              d={generatePath(data.datasets[0]?.data || [], 100, 100)}
              fill="url(#gradient1)"
              stroke="rgb(59, 130, 246)"
              strokeWidth="2"
            />
          </svg>
          
          {/* Linha de dados 2 */}
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(34, 197, 94, 0.8)" />
                <stop offset="100%" stopColor="rgba(34, 197, 94, 0.1)" />
              </linearGradient>
            </defs>
            <path
              d={generatePath(data.datasets[1]?.data || [], 100, 100)}
              fill="url(#gradient2)"
              stroke="rgb(34, 197, 94)"
              strokeWidth="2"
            />
          </svg>
        </div>
        
        {/* Legenda */}
        <div className="absolute top-2 right-2 flex gap-4 text-xs">
          {data.datasets.map((dataset, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: dataset.borderColor }}
              />
              <span className="text-muted-foreground">{dataset.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function generatePath(data: number[], width: number, height: number): string {
  if (data.length === 0) return "";
  
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - minValue) / range) * height;
    return `${x},${y}`;
  });
  
  const pathData = points.map((point, index) => {
    if (index === 0) return `M ${point}`;
    return `L ${point}`;
  }).join(" ");
  
  // Fechar o caminho para criar uma área
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  
  return `${pathData} L ${lastPoint.split(",")[0]},${height} L ${firstPoint.split(",")[0]},${height} Z`;
}
