"use client";

import { getUserSettings, updateUserPreferences } from "@/actions/users";
import { EditProfileModal } from "@/app/(admin)/admin/dashboard/settings/_components/edit-profile-modal";
import { SecuritySettingsModal } from "@/app/(admin)/admin/dashboard/settings/_components/security-settings-modal";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAvatarUrl } from "@/hooks/use-avatar-url";
import {
  IconBell,
  IconBrandDiscord,
  IconBrandFigma,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandNotion,
  IconBrandSlack,
  IconCheck,
  IconDeviceMobile,
  IconDownload,
  IconEdit,
  IconLock,
  IconMail,
  IconPalette,
  IconSettings,
  IconShield,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UserSettings {
  profile: {
    id: string;
    name: string;
    email: string;
    image?: string;
    bio?: string;
    location?: string;
    website?: string;
    phone?: string;
    role: string;
    status: string;
    createdAt: string | Date;
    lastLoginAt?: string | Date;
    loginCount: number;
    isOnline: boolean;
  };
  preferences: {
    notifications: {
      email: {
        courseUpdates: boolean;
        newMessages: boolean;
        systemAlerts: boolean;
        marketing: boolean;
      };
      push: {
        courseUpdates: boolean;
        newMessages: boolean;
        systemAlerts: boolean;
        marketing: boolean;
      };
      sms: {
        courseUpdates: boolean;
        newMessages: boolean;
        systemAlerts: boolean;
        marketing: boolean;
      };
    };
    privacy: {
      profileVisibility: string;
      showEmail: boolean;
      showPhone: boolean;
      allowMessages: boolean;
      showOnlineStatus: boolean;
      allowAnalytics: boolean;
    };
    appearance: {
      theme: string;
      language: string;
      fontSize: string;
      compactMode: boolean;
      showAnimations: boolean;
    };
    twoFactorEnabled: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    activeSessions: number;
    loginHistory: Array<{
      id: string;
      date: string | Date;
      device: string;
      location: string;
      ipAddress?: string;
    }>;
  };
  theme: string;
  language: string;
  timezone?: string;
}

export default function ConfiguracoesPage() {
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [preferences, setPreferences] = useState<
    UserSettings["preferences"] | null
  >(null);

  // Hook para gerenciar URL do avatar
  const { avatarUrl } = useAvatarUrl(userSettings?.profile.image);

  // Carregar configurações do usuário
  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const result = await getUserSettings();
        if (result.success && result.settings) {
          setUserSettings(result.settings as UserSettings);
          setPreferences(
            result.settings.preferences as UserSettings["preferences"]
          );
        } else {
          toast.error("Erro ao carregar configurações");
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        toast.error("Erro interno do servidor");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserSettings();
  }, []);

  // Salvar preferências
  const handleSavePreferences = async () => {
    if (!preferences) return;

    try {
      const formData = new FormData();

      // Notificações por email
      formData.append(
        "email_courseUpdates",
        preferences.notifications.email.courseUpdates ? "on" : ""
      );
      formData.append(
        "email_newMessages",
        preferences.notifications.email.newMessages ? "on" : ""
      );
      formData.append(
        "email_systemAlerts",
        preferences.notifications.email.systemAlerts ? "on" : ""
      );
      formData.append(
        "email_marketing",
        preferences.notifications.email.marketing ? "on" : ""
      );

      // Notificações push
      formData.append(
        "push_courseUpdates",
        preferences.notifications.push.courseUpdates ? "on" : ""
      );
      formData.append(
        "push_newMessages",
        preferences.notifications.push.newMessages ? "on" : ""
      );
      formData.append(
        "push_systemAlerts",
        preferences.notifications.push.systemAlerts ? "on" : ""
      );
      formData.append(
        "push_marketing",
        preferences.notifications.push.marketing ? "on" : ""
      );

      // Notificações SMS
      formData.append(
        "sms_courseUpdates",
        preferences.notifications.sms.courseUpdates ? "on" : ""
      );
      formData.append(
        "sms_newMessages",
        preferences.notifications.sms.newMessages ? "on" : ""
      );
      formData.append(
        "sms_systemAlerts",
        preferences.notifications.sms.systemAlerts ? "on" : ""
      );
      formData.append(
        "sms_marketing",
        preferences.notifications.sms.marketing ? "on" : ""
      );

      // Privacidade
      formData.append(
        "profileVisibility",
        preferences.privacy.profileVisibility
      );
      formData.append("showEmail", preferences.privacy.showEmail ? "on" : "");
      formData.append("showPhone", preferences.privacy.showPhone ? "on" : "");
      formData.append(
        "allowMessages",
        preferences.privacy.allowMessages ? "on" : ""
      );
      formData.append(
        "showOnlineStatus",
        preferences.privacy.showOnlineStatus ? "on" : ""
      );
      formData.append(
        "allowAnalytics",
        preferences.privacy.allowAnalytics ? "on" : ""
      );

      // Aparência
      formData.append("theme", preferences.appearance.theme);
      formData.append("language", preferences.appearance.language);
      formData.append("fontSize", preferences.appearance.fontSize);
      formData.append(
        "compactMode",
        preferences.appearance.compactMode ? "on" : ""
      );
      formData.append(
        "showAnimations",
        preferences.appearance.showAnimations ? "on" : ""
      );

      const result = await updateUserPreferences(formData);

      if (result.success) {
        toast.success("Preferências salvas com sucesso!");
        // Recarregar configurações
        const newResult = await getUserSettings();
        if (newResult.success && newResult.settings) {
          setUserSettings(newResult.settings as UserSettings);
          setPreferences(
            newResult.settings.preferences as UserSettings["preferences"]
          );
        }
      } else {
        toast.error(result.error || "Erro ao salvar preferências");
      }
    } catch (error) {
      console.error("Erro ao salvar preferências:", error);
      toast.error("Erro interno do servidor");
    }
  };

  // Atualizar preferência específica
  const updatePreference = (path: string, value: boolean | string) => {
    if (!preferences) return;

    const keys = path.split(".");
    const newPreferences = JSON.parse(JSON.stringify(preferences));
    let current = newPreferences;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setPreferences(newPreferences);
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando configurações...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userSettings || !preferences) {
    return (
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground">
              Erro ao carregar configurações
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | Date) => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDeviceIcon = (device: string) => {
    if (device.includes("iPhone") || device.includes("Mobile")) {
      return <IconDeviceMobile className="h-4 w-4" />;
    }
    return <IconSettings className="h-4 w-4" />;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Configurações
          </h2>
          <p className="text-muted-foreground">
            Gerencie suas preferências e configurações da conta
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <IconDownload className="h-4 w-4 mr-2" />
            Exportar Dados
          </Button>
          <Button variant="default" size="sm" onClick={handleSavePreferences}>
            <IconCheck className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      {/* Perfil do Usuário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUser className="h-5 w-5" />
            Perfil da Conta
          </CardTitle>
          <CardDescription>Informações básicas da sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={userSettings.profile.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
              ) : (
                <AvatarFallback className="text-lg">
                  {getInitials(userSettings.profile.name)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                {userSettings.profile.name}
              </h3>
              <p className="text-muted-foreground">
                {userSettings.profile.email}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="default">{userSettings.profile.role}</Badge>
                <Badge variant="outline">{userSettings.profile.status}</Badge>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditProfileOpen(true)}
            >
              <IconEdit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>

          <Separator />

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" value={userSettings.profile.name} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userSettings.profile.email}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Input id="bio" value={userSettings.profile.bio || ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                value={userSettings.profile.location || ""}
                readOnly
              />
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 text-sm">
            <div>
              <p className="font-medium">Membro desde</p>
              <p className="text-muted-foreground">
                {formatDate(userSettings.profile.createdAt)}
              </p>
            </div>
            <div>
              <p className="font-medium">Último login</p>
              <p className="text-muted-foreground">
                {userSettings.profile.lastLoginAt
                  ? formatDate(userSettings.profile.lastLoginAt)
                  : "Nunca"}
              </p>
            </div>
            <div>
              <p className="font-medium">Sessões ativas</p>
              <p className="text-muted-foreground">
                {userSettings.security.activeSessions}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Configurações */}
      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <IconBell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <IconShield className="h-4 w-4" />
            Privacidade
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <IconPalette className="h-4 w-4" />
            Aparência
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <IconLock className="h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <IconSettings className="h-4 w-4" />
            Integrações
          </TabsTrigger>
        </TabsList>

        {/* Notificações */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificação</CardTitle>
              <CardDescription>
                Escolha como e quando receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <IconMail className="h-4 w-4" />
                  Notificações por Email
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Atualizações de Cursos</p>
                      <p className="text-sm text-muted-foreground">
                        Receba notificações sobre novos conteúdos
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notifications.email.courseUpdates}
                      onCheckedChange={(checked) =>
                        updatePreference(
                          "notifications.email.courseUpdates",
                          checked
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Novas Mensagens</p>
                      <p className="text-sm text-muted-foreground">
                        Notificações de mensagens recebidas
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notifications.email.newMessages}
                      onCheckedChange={(checked) =>
                        updatePreference(
                          "notifications.email.newMessages",
                          checked
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Alertas do Sistema</p>
                      <p className="text-sm text-muted-foreground">
                        Notificações importantes do sistema
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notifications.email.systemAlerts}
                      onCheckedChange={(checked) =>
                        updatePreference(
                          "notifications.email.systemAlerts",
                          checked
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing</p>
                      <p className="text-sm text-muted-foreground">
                        Ofertas e novidades da plataforma
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notifications.email.marketing}
                      onCheckedChange={(checked) =>
                        updatePreference(
                          "notifications.email.marketing",
                          checked
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Push Notifications */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <IconBell className="h-4 w-4" />
                  Notificações Push
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Atualizações de Cursos</p>
                      <p className="text-sm text-muted-foreground">
                        Receba notificações sobre novos conteúdos
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notifications.push.courseUpdates}
                      onCheckedChange={(checked) =>
                        updatePreference(
                          "notifications.push.courseUpdates",
                          checked
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Novas Mensagens</p>
                      <p className="text-sm text-muted-foreground">
                        Notificações de mensagens recebidas
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notifications.push.newMessages}
                      onCheckedChange={(checked) =>
                        updatePreference(
                          "notifications.push.newMessages",
                          checked
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Alertas do Sistema</p>
                      <p className="text-sm text-muted-foreground">
                        Notificações importantes do sistema
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notifications.push.systemAlerts}
                      onCheckedChange={(checked) =>
                        updatePreference(
                          "notifications.push.systemAlerts",
                          checked
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacidade */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Privacidade</CardTitle>
              <CardDescription>
                Controle como suas informações são exibidas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-visibility">
                    Visibilidade do Perfil
                  </Label>
                  <Select
                    value={preferences.privacy.profileVisibility}
                    onValueChange={(value) =>
                      updatePreference("privacy.profileVisibility", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Público</SelectItem>
                      <SelectItem value="friends">Apenas Amigos</SelectItem>
                      <SelectItem value="private">Privado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Mostrar Email</p>
                      <p className="text-sm text-muted-foreground">
                        Permitir que outros vejam seu email
                      </p>
                    </div>
                    <Switch
                      checked={preferences.privacy.showEmail}
                      onCheckedChange={(checked) =>
                        updatePreference("privacy.showEmail", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Mostrar Telefone</p>
                      <p className="text-sm text-muted-foreground">
                        Permitir que outros vejam seu telefone
                      </p>
                    </div>
                    <Switch
                      checked={preferences.privacy.showPhone}
                      onCheckedChange={(checked) =>
                        updatePreference("privacy.showPhone", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Permitir Mensagens</p>
                      <p className="text-sm text-muted-foreground">
                        Receber mensagens de outros usuários
                      </p>
                    </div>
                    <Switch
                      checked={preferences.privacy.allowMessages}
                      onCheckedChange={(checked) =>
                        updatePreference("privacy.allowMessages", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Status Online</p>
                      <p className="text-sm text-muted-foreground">
                        Mostrar quando você está online
                      </p>
                    </div>
                    <Switch
                      checked={preferences.privacy.showOnlineStatus}
                      onCheckedChange={(checked) =>
                        updatePreference("privacy.showOnlineStatus", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Analytics</p>
                      <p className="text-sm text-muted-foreground">
                        Permitir coleta de dados para melhorias
                      </p>
                    </div>
                    <Switch
                      checked={preferences.privacy.allowAnalytics}
                      onCheckedChange={(checked) =>
                        updatePreference("privacy.allowAnalytics", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aparência */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Aparência</CardTitle>
              <CardDescription>
                Personalize a aparência da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select
                    value={preferences.appearance.theme}
                    onValueChange={(value) =>
                      updatePreference("appearance.theme", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select
                    value={preferences.appearance.language}
                    onValueChange={(value) =>
                      updatePreference("appearance.language", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="font-size">Tamanho da Fonte</Label>
                  <Select
                    value={preferences.appearance.fontSize}
                    onValueChange={(value) =>
                      updatePreference("appearance.fontSize", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Pequeno</SelectItem>
                      <SelectItem value="medium">Médio</SelectItem>
                      <SelectItem value="large">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Modo Compacto</p>
                    <p className="text-sm text-muted-foreground">
                      Reduzir espaçamentos da interface
                    </p>
                  </div>
                  <Switch
                    checked={preferences.appearance.compactMode}
                    onCheckedChange={(checked) =>
                      updatePreference("appearance.compactMode", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Animações</p>
                    <p className="text-sm text-muted-foreground">
                      Mostrar animações e transições
                    </p>
                  </div>
                  <Switch
                    checked={preferences.appearance.showAnimations}
                    onCheckedChange={(checked) =>
                      updatePreference("appearance.showAnimations", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Segurança */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>
                Gerencie a segurança da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">
                      Autenticação de Dois Fatores
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Adicione uma camada extra de segurança
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        userSettings.security.twoFactorEnabled
                          ? "default"
                          : "outline"
                      }
                    >
                      {userSettings.security.twoFactorEnabled
                        ? "Ativo"
                        : "Inativo"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsSecurityModalOpen(true)}
                    >
                      Configurar
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium">Autenticação</h4>
                  <p className="text-sm text-muted-foreground">
                    Este sistema usa autenticação por email (OTP). Para fazer
                    login, você receberá um código por email.
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Sessões Ativas</h4>
                  <div className="space-y-3">
                    {userSettings.security.loginHistory.map(
                      (
                        session: UserSettings["security"]["loginHistory"][0],
                        index: number
                      ) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {getDeviceIcon(session.device)}
                            <div>
                              <p className="font-medium text-sm">
                                {session.device}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {session.location}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">
                              {formatDate(session.date)}
                            </p>
                            {index === 0 && (
                              <Badge variant="default" className="text-xs">
                                Atual
                              </Badge>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSecurityModalOpen(true)}
                  >
                    <IconTrash className="h-4 w-4 mr-2" />
                    Encerrar Outras Sessões
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrações */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>
                Conecte sua conta com outras plataformas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <IconBrandGithub className="h-6 w-6" />
                    <div>
                      <h4 className="font-medium">GitHub</h4>
                      <p className="text-sm text-muted-foreground">
                        Conectar repositórios
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Conectar
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <IconBrandLinkedin className="h-6 w-6" />
                    <div>
                      <h4 className="font-medium">LinkedIn</h4>
                      <p className="text-sm text-muted-foreground">
                        Importar perfil
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Conectar
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <IconBrandNotion className="h-6 w-6" />
                    <div>
                      <h4 className="font-medium">Notion</h4>
                      <p className="text-sm text-muted-foreground">
                        Sincronizar notas
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Conectar
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <IconBrandSlack className="h-6 w-6" />
                    <div>
                      <h4 className="font-medium">Slack</h4>
                      <p className="text-sm text-muted-foreground">
                        Notificações
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Conectar
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <IconBrandDiscord className="h-6 w-6" />
                    <div>
                      <h4 className="font-medium">Discord</h4>
                      <p className="text-sm text-muted-foreground">
                        Comunidade
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Conectar
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <IconBrandFigma className="h-6 w-6" />
                    <div>
                      <h4 className="font-medium">Figma</h4>
                      <p className="text-sm text-muted-foreground">
                        Design files
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Conectar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modais */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={userSettings.profile}
        onSuccess={() => {
          // Recarregar configurações após edição
          const reloadSettings = async () => {
            const result = await getUserSettings();
            if (result.success && result.settings) {
              setUserSettings(result.settings as UserSettings);
              setPreferences(
                result.settings.preferences as UserSettings["preferences"]
              );
            }
          };
          reloadSettings();
        }}
      />

      <SecuritySettingsModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        twoFactorEnabled={userSettings.security.twoFactorEnabled}
        activeSessions={userSettings.security.activeSessions}
        onSuccess={() => {
          // Recarregar configurações após alterações de segurança
          const reloadSettings = async () => {
            const result = await getUserSettings();
            if (result.success && result.settings) {
              setUserSettings(result.settings as UserSettings);
              setPreferences(
                result.settings.preferences as UserSettings["preferences"]
              );
            }
          };
          reloadSettings();
        }}
      />
    </div>
  );
}
