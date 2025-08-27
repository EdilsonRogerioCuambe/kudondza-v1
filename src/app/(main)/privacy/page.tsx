import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Database, Eye, Lock, Mail, MapPin, Phone, Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4">
          <Shield className="w-4 h-4 mr-2" />
          Política de Privacidade
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          Política de Privacidade
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
              <Eye className="w-5 h-5 text-primary" />
              Informações que Coletamos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Coletamos informações que você nos fornece diretamente, como
              quando cria uma conta, se inscreve em um curso ou entra em contato
              conosco.
            </p>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">
                Informações pessoais:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Nome completo e informações de contato</li>
                <li>Endereço de email e número de telefone</li>
                <li>Informações de perfil e preferências educacionais</li>
                <li>Dados de pagamento (processados de forma segura)</li>
                <li>Conteúdo que você cria ou compartilha na plataforma</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Como Usamos Suas Informações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Usamos as informações coletadas para fornecer, manter e melhorar
              nossos serviços educacionais.
            </p>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">
                Principais usos:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Fornecer acesso aos cursos e materiais educacionais</li>
                <li>Personalizar sua experiência de aprendizado</li>
                <li>Processar pagamentos e gerenciar assinaturas</li>
                <li>Enviar comunicações importantes sobre sua conta</li>
                <li>Melhorar nossos serviços e desenvolver novos recursos</li>
                <li>Cumprir obrigações legais e regulamentares</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Compartilhamento de Informações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Não vendemos, alugamos ou compartilhamos suas informações pessoais
              com terceiros, exceto nas seguintes circunstâncias:
            </p>
            <div className="space-y-2">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Com seu consentimento explícito</li>
                <li>
                  Com provedores de serviços que nos ajudam a operar a
                  plataforma
                </li>
                <li>
                  Para cumprir obrigações legais ou responder a processos legais
                </li>
                <li>Para proteger nossos direitos, propriedade ou segurança</li>
                <li>Em caso de fusão, aquisição ou venda de ativos</li>
              </ul>
            </div>
            <p className="text-muted-foreground">
              Todos os provedores de serviços terceiros são obrigados a manter a
              confidencialidade e segurança de suas informações.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Segurança dos Dados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Implementamos medidas de segurança técnicas e organizacionais
              apropriadas para proteger suas informações pessoais contra acesso
              não autorizado, alteração, divulgação ou destruição.
            </p>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">
                Medidas de segurança incluem:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Criptografia de dados em trânsito e em repouso</li>
                <li>Controles de acesso rigorosos</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Backups regulares e seguros</li>
                <li>Treinamento de funcionários em práticas de segurança</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seus Direitos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Você tem direitos relacionados às suas informações pessoais,
              incluindo:
            </p>
            <div className="space-y-2">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>
                  <strong>Acesso:</strong> Solicitar uma cópia das informações
                  que temos sobre você
                </li>
                <li>
                  <strong>Correção:</strong> Solicitar correção de informações
                  imprecisas
                </li>
                <li>
                  <strong>Exclusão:</strong> Solicitar a exclusão de suas
                  informações pessoais
                </li>
                <li>
                  <strong>Portabilidade:</strong> Receber suas informações em
                  formato estruturado
                </li>
                <li>
                  <strong>Oposição:</strong> Opor-se ao processamento de suas
                  informações
                </li>
                <li>
                  <strong>Retirada do consentimento:</strong> Retirar
                  consentimento a qualquer momento
                </li>
              </ul>
            </div>
            <p className="text-muted-foreground">
              Para exercer esses direitos, entre em contato conosco através dos
              canais listados abaixo.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cookies e Tecnologias Similares</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Usamos cookies e tecnologias similares para melhorar sua
              experiência, analisar o uso da plataforma e personalizar conteúdo.
            </p>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">
                Tipos de cookies que usamos:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>
                  <strong>Essenciais:</strong> Necessários para o funcionamento
                  básico da plataforma
                </li>
                <li>
                  <strong>Funcionais:</strong> Melhoram a funcionalidade e
                  personalização
                </li>
                <li>
                  <strong>Analíticos:</strong> Nos ajudam a entender como a
                  plataforma é usada
                </li>
                <li>
                  <strong>Marketing:</strong> Usados para mostrar conteúdo
                  relevante
                </li>
              </ul>
            </div>
            <p className="text-muted-foreground">
              Você pode gerenciar suas preferências de cookies através das
              configurações do seu navegador.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Retenção de Dados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Mantemos suas informações pessoais apenas pelo tempo necessário
              para cumprir os propósitos descritos nesta política, a menos que
              um período de retenção mais longo seja exigido ou permitido por
              lei.
            </p>
            <p className="text-muted-foreground">
              Quando você solicita a exclusão de sua conta, excluímos ou
              anonimizamos suas informações pessoais, exceto quando a retenção é
              necessária para fins legais, de segurança ou de negócios
              legítimos.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alterações na Política</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Podemos atualizar esta Política de Privacidade periodicamente.
              Notificaremos você sobre mudanças materiais enviando um email para
              o endereço associado à sua conta ou publicando um aviso na
              plataforma.
            </p>
            <p className="text-muted-foreground">
              Recomendamos que você revise esta política regularmente para se
              manter informado sobre como protegemos suas informações.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Se você tiver dúvidas sobre esta Política de Privacidade ou sobre
              como tratamos suas informações pessoais, entre em contato conosco:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>
                    <strong>Email:</strong> edicuambe@gmail.com
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>
                    <strong>Telefone:</strong> +55 85 99967-0030
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    <strong>Endereço:</strong> São Paulo, Brasil
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-12" />

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Esta política foi atualizada pela última vez em{" "}
          {new Date().toLocaleDateString("pt-BR")}. Para obter informações sobre
          versões anteriores desta política, entre em contato conosco.
        </p>
      </div>
    </div>
  );
}
