import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, FileText, Shield, Users } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4">
          <FileText className="w-4 h-4 mr-2" />
          Termos de Serviço
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          Termos de Serviço
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Aceitação dos Termos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Ao acessar e usar a plataforma Kudondza, você concorda em cumprir
              e estar vinculado a estes Termos de Serviço. Se você não concordar
              com qualquer parte destes termos, não poderá acessar o serviço.
            </p>
            <p className="text-muted-foreground">
              Estes termos se aplicam a todos os visitantes, usuários e outras
              pessoas que acessam ou usam o serviço.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Uso do Serviço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              A plataforma Kudondza é uma plataforma educacional online que
              oferece cursos, materiais de aprendizado e ferramentas de
              colaboração. Você pode usar nossos serviços apenas para fins
              legais e de acordo com estes Termos.
            </p>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">
                Você concorda em:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>
                  Fornecer informações precisas e completas ao se registrar
                </li>
                <li>Manter a confidencialidade de sua conta e senha</li>
                <li>Usar o serviço apenas para fins educacionais legítimos</li>
                <li>
                  Não compartilhar conteúdo protegido por direitos autorais
                </li>
                <li>Respeitar outros usuários e instrutores</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Propriedade Intelectual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              O serviço e seu conteúdo original, recursos e funcionalidades são
              e permanecerão propriedade exclusiva da Kudondza e seus
              licenciadores. O serviço é protegido por direitos autorais, marcas
              comerciais e outras leis de propriedade intelectual.
            </p>
            <p className="text-muted-foreground">
              Você pode usar o conteúdo dos cursos apenas para fins educacionais
              pessoais. A redistribuição, reprodução ou uso comercial do
              conteúdo sem permissão expressa é estritamente proibida.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacidade e Dados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Sua privacidade é importante para nós. Nossa coleta e uso de
              informações pessoais são regidos pela nossa Política de
              Privacidade, que está incorporada a estes Termos por referência.
            </p>
            <p className="text-muted-foreground">
              Ao usar nosso serviço, você concorda com a coleta e uso de
              informações de acordo com nossa Política de Privacidade.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limitação de Responsabilidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Em nenhuma circunstância a Kudondza, seus diretores, funcionários,
              parceiros, agentes, fornecedores ou afiliados serão responsáveis
              por quaisquer danos indiretos, incidentais, especiais,
              consequenciais ou punitivos.
            </p>
            <p className="text-muted-foreground">
              Nosso serviço é fornecido &quot;como está&quot; e &quot;conforme disponível&quot; sem
              garantias de qualquer tipo.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Modificações dos Termos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Reservamo-nos o direito de modificar ou substituir estes Termos a
              qualquer momento. Se uma revisão for material, forneceremos pelo
              menos 30 dias de aviso prévio antes de qualquer novo termo entrar
              em vigor.
            </p>
            <p className="text-muted-foreground">
              O que constitui uma mudança material será determinado a nosso
              critério exclusivo.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Se você tiver alguma dúvida sobre estes Termos de Serviço, entre
              em contato conosco:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Email:</strong> edicuambe@gmail.com
                <br />
                <strong>Endereço:</strong> São Paulo, Brasil
                <br />
                <strong>Telefone:</strong> +55 85 99967-0030
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-12" />

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Estes termos foram atualizados pela última vez em{" "}
          {new Date().toLocaleDateString("pt-BR")}. Recomendamos que você revise
          estes termos periodicamente para se manter informado sobre quaisquer
          mudanças.
        </p>
      </div>
    </div>
  );
}
