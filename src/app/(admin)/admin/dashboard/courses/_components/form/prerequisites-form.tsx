import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { handleNumericChange } from "@/lib/handle-numeric-change";
import { Users } from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function PrerequisitesForm() {
  const form = useFormContext();
  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Pré-requisitos e Gamificação
        </CardTitle>
        <CardDescription>
          Configure pré-requisitos e sistema de recompensas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="hasPrerequisites"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Possui Pré-requisitos
                </FormLabel>
                <div className="text-sm text-muted-foreground">
                  Este curso requer conhecimentos prévios
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch("hasPrerequisites") && (
          <div className="space-y-4">
            <div className="text-sm font-medium">Cursos Pré-requisitos</div>
            <div className="text-center py-4 text-muted-foreground">
              Funcionalidade de pré-requisitos será implementada em breve.
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="xpReward"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pontos XP de Recompensa</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="500"
                    value={field.value || ""}
                    onChange={handleNumericChange(field.onChange)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="badgeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Badge de Conclusão</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um badge" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Iniciante</SelectItem>
                    <SelectItem value="intermediate">Intermediário</SelectItem>
                    <SelectItem value="advanced">Avançado</SelectItem>
                    <SelectItem value="expert">Especialista</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
