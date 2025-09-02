"use client";

import {
  createNotification,
  updateNotification,
} from "@/actions/notifications";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { NotificationType } from "./types";

interface NotificationFormProps {
  notification?: NotificationType;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

export function NotificationForm({
  notification,
  onSuccess,
  trigger,
}: NotificationFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "INFO" as const,
    userId: "",
    actionUrl: "",
  });

  useEffect(() => {
    if (notification) {
      setFormData({
        title: notification.title,
        message: notification.message,
        type: "INFO" as const,
        userId: notification.userId,
        actionUrl: notification.actionUrl || "",
      });
    } else {
      setFormData({
        title: "",
        message: "",
        type: "INFO",
        userId: "",
        actionUrl: "",
      });
    }
  }, [notification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (notification) {
        await updateNotification({
          id: notification.id,
          ...formData,
          actionUrl: formData.actionUrl || undefined,
        });
        toast.success("Notificação atualizada com sucesso!");
      } else {
        await createNotification({
          ...formData,
          actionUrl: formData.actionUrl || undefined,
        });
        toast.success("Notificação criada com sucesso!");
      }

      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar notificação:", error);
      toast.error("Erro ao salvar notificação");
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = notification ? (
    <Button variant="ghost" size="sm">
      <IconEdit className="h-4 w-4" />
    </Button>
  ) : (
    <Button size="sm">
      <IconPlus className="h-4 w-4 mr-2" />
      Nova Notificação
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {notification ? "Editar Notificação" : "Nova Notificação"}
          </DialogTitle>
          <DialogDescription>
            {notification
              ? "Atualize os dados da notificação."
              : "Crie uma nova notificação para os usuários."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Digite o título da notificação"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message">Mensagem *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Digite a mensagem da notificação"
              rows={4}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Tipo *</Label>
            <Select
              value={formData.type}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onValueChange={(value: any) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INFO">Informação</SelectItem>
                <SelectItem value="SUCCESS">Sucesso</SelectItem>
                <SelectItem value="WARNING">Aviso</SelectItem>
                <SelectItem value="ERROR">Erro</SelectItem>
                <SelectItem value="ACHIEVEMENT">Conquista</SelectItem>
                <SelectItem value="SOCIAL">Social</SelectItem>
                <SelectItem value="SYSTEM">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="userId">ID do Usuário *</Label>
            <Input
              id="userId"
              value={formData.userId}
              onChange={(e) =>
                setFormData({ ...formData, userId: e.target.value })
              }
              placeholder="Digite o ID do usuário"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="actionUrl">URL de Ação (opcional)</Label>
            <Input
              id="actionUrl"
              value={formData.actionUrl}
              onChange={(e) =>
                setFormData({ ...formData, actionUrl: e.target.value })
              }
              placeholder="https://exemplo.com/acao"
              type="url"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : notification ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
