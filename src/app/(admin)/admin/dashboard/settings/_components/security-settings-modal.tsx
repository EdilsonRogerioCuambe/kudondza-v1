"use client";

import { terminateOtherSessions, toggleTwoFactorAuth } from "@/actions/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { IconLock, IconShield, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

interface SecuritySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  twoFactorEnabled: boolean;
  activeSessions: number;
  onSuccess?: () => void;
}

export function SecuritySettingsModal({
  isOpen,
  onClose,
  twoFactorEnabled,
  activeSessions,
  onSuccess,
}: SecuritySettingsModalProps) {
  const [isToggling2FA, setIsToggling2FA] = useState(false);
  const [isTerminatingSessions, setIsTerminatingSessions] = useState(false);

  const handleToggle2FA = async () => {
    setIsToggling2FA(true);

    try {
      const result = await toggleTwoFactorAuth();

      if (result.success) {
        toast.success(result.message || "2FA alterado com sucesso!");
        onSuccess?.();
      } else {
        toast.error(result.error || "Erro ao alterar 2FA");
      }
    } catch (error) {
      console.error("Erro ao alterar 2FA:", error);
      toast.error("Erro interno do servidor");
    } finally {
      setIsToggling2FA(false);
    }
  };

  const handleTerminateSessions = async () => {
    setIsTerminatingSessions(true);

    try {
      const result = await terminateOtherSessions();

      if (result.success) {
        toast.success("Outras sessões encerradas com sucesso!");
        onSuccess?.();
      } else {
        toast.error(result.error || "Erro ao encerrar sessões");
      }
    } catch (error) {
      console.error("Erro ao encerrar sessões:", error);
      toast.error("Erro interno do servidor");
    } finally {
      setIsTerminatingSessions(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconShield className="h-5 w-5" />
            Configurações de Segurança
          </DialogTitle>
          <DialogDescription>
            Gerencie a segurança da sua conta e senhas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Autenticação de Dois Fatores */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium flex items-center gap-2">
                  <IconShield className="h-4 w-4" />
                  Autenticação de Dois Fatores
                </h4>
                <p className="text-sm text-muted-foreground">
                  Adicione uma camada extra de segurança
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={twoFactorEnabled ? "default" : "outline"}>
                  {twoFactorEnabled ? "Ativo" : "Inativo"}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggle2FA}
                  disabled={isToggling2FA}
                >
                  {isToggling2FA
                    ? "Alterando..."
                    : twoFactorEnabled
                    ? "Desativar"
                    : "Ativar"}
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Autenticação */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <IconLock className="h-4 w-4" />
              Autenticação
            </h4>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <IconLock className="h-5 w-5 text-blue-600 mt-0.5" />
                </div>
                <div>
                  <h5 className="font-medium text-blue-900 mb-1">
                    Sistema de Autenticação por Email
                  </h5>
                  <p className="text-sm text-blue-700 mb-3">
                    Este sistema usa autenticação por email (OTP) em vez de
                    senhas tradicionais. Para fazer login, você receberá um
                    código por email.
                  </p>
                  <div className="text-sm text-blue-600">
                    <p className="font-medium mb-1">Como funciona:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Digite seu email no login</li>
                      <li>Receba um código por email</li>
                      <li>Digite o código para acessar sua conta</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Sessões Ativas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium flex items-center gap-2">
                  <IconTrash className="h-4 w-4" />
                  Sessões Ativas
                </h4>
                <p className="text-sm text-muted-foreground">
                  {activeSessions} sessão(ões) ativa(s)
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTerminateSessions}
                disabled={isTerminatingSessions || activeSessions <= 1}
              >
                {isTerminatingSessions
                  ? "Encerrando..."
                  : "Encerrar Outras Sessões"}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
