"use client";

import { Button } from "@/components/ui/button";
import {
  IconAlertTriangle,
  IconCheck,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  const [visibleToasts, setVisibleToasts] = useState<Toast[]>([]);

  useEffect(() => {
    setVisibleToasts(toasts);
  }, [toasts]);

  const getToastIcon = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return <IconCheck className="h-4 w-4" />;
      case "error":
        return <IconX className="h-4 w-4" />;
      case "warning":
        return <IconAlertTriangle className="h-4 w-4" />;
      case "info":
        return <IconInfoCircle className="h-4 w-4" />;
      default:
        return <IconInfoCircle className="h-4 w-4" />;
    }
  };

  const getToastVariant = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "default";
      case "error":
        return "destructive";
      case "warning":
        return "default";
      case "info":
        return "default";
      default:
        return "default";
    }
  };

  const getToastStyles = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200";
      case "error":
        return "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-green-950 dark:text-red-200";
      case "warning":
        return "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200";
      case "info":
        return "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200";
      default:
        return "border-gray-200 bg-gray-50 text-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200";
    }
  };

  if (visibleToasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {visibleToasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-in slide-in-from-right-full duration-300 border rounded-lg p-4 shadow-lg ${getToastStyles(
            toast.type
          )}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getToastIcon(toast.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium">{toast.title}</h4>
              <p className="text-sm mt-1 opacity-90">{toast.message}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0 h-6 w-6 p-0 opacity-70 hover:opacity-100"
              onClick={() => onClose(toast.id)}
            >
              <IconX className="h-3 w-3" />
              <span className="sr-only">Fechar</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
