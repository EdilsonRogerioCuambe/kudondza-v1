# Módulo de Certificados

Este módulo fornece funcionalidades completas para gerenciamento de certificados na plataforma Kudondza.

## Funcionalidades

### 1. Gestão de Certificados (Admin)

- **Listagem de Certificados**: Visualize todos os certificados emitidos com filtros e paginação
- **Criação de Certificados**: Emita novos certificados para usuários
- **Edição de Certificados**: Atualize informações de certificados existentes
- **Visualização Detalhada**: Veja todos os detalhes de um certificado específico
- **Validação/Invalidação**: Controle o status de validade dos certificados
- **Exclusão**: Remova certificados quando necessário

### 2. Verificação Pública

- **Verificação Online**: Sistema público para verificar autenticidade de certificados
- **Código de Verificação**: Cada certificado possui um código único de 8 caracteres
- **Interface Responsiva**: Página pública acessível a qualquer pessoa

### 3. Recursos Técnicos

- **Números Únicos**: Cada certificado recebe um número único automático
- **Códigos de Verificação**: Códigos alfanuméricos únicos para verificação
- **Validade Configurável**: Defina datas de expiração opcionais
- **Integração com Gamificação**: Atualiza contadores de certificados dos usuários

## Estrutura de Arquivos

```
src/
├── actions/certificates/
│   ├── index.ts                    # Exportações das actions
│   ├── get-certificates.ts         # Buscar certificados
│   ├── create-certificate.ts       # Criar certificados
│   ├── update-certificate.ts       # Atualizar certificados
│   └── delete-certificate.ts       # Deletar certificados
├── app/
│   ├── (admin)/admin/dashboard/certificates/
│   │   ├── page.tsx                # Lista de certificados
│   │   ├── create/page.tsx         # Criar certificado
│   │   └── [id]/
│   │       ├── page.tsx            # Visualizar certificado
│   │       └── edit/page.tsx       # Editar certificado
│   ├── api/certificates/
│   │   ├── verify/route.ts         # API de verificação
│   │   └── [id]/generate-pdf/route.ts # API de geração de PDF
│   └── verify/[code]/page.tsx      # Página pública de verificação
└── lib/
    └── zod-schema.ts               # Schemas de validação
```

## Modelo de Dados

### Certificate (Prisma Schema)

```prisma
model Certificate {
  id                String @id @default(cuid())
  certificateNumber String @unique
  verificationCode  String @unique
  title             String
  description       String?
  templateData      Json
  certificateUrl    String?
  isValid           Boolean @default(true)
  validUntil        DateTime?
  issuedAt          DateTime @default(now())
  createdAt         DateTime @default(now())

  userId   String
  user     User   @relation(fields: [userId], references: [id])
  courseId String
  course   Course @relation(fields: [courseId], references: [id])

  @@map("certificates")
}
```

## Rotas da API

### 1. Verificação de Certificado

```
POST /api/certificates/verify
```

**Body:**

```json
{
  "verificationCode": "ABC12345"
}
```

### 2. Geração de PDF

```
POST /api/certificates/[id]/generate-pdf
```

## Páginas

### Admin Dashboard

#### 1. Lista de Certificados (`/admin/dashboard/certificates`)

- Estatísticas em tempo real
- Filtros avançados (busca, status, ordenação)
- Seleção múltipla para ações em lote
- Paginação

#### 2. Criar Certificado (`/admin/dashboard/certificates/create`)

- Seleção de usuário e curso
- Configuração de título e descrição
- Data de validade opcional
- Geração automática de códigos únicos

#### 3. Visualizar Certificado (`/admin/dashboard/certificates/[id]`)

- Informações completas do certificado
- Status de validade
- Informações do usuário e curso
- Ações de validação/invalidação
- Links para verificação pública

#### 4. Editar Certificado (`/admin/dashboard/certificates/[id]/edit`)

- Edição de título e descrição
- Alteração de data de validade
- Informações de contexto

### Página Pública

#### Verificação (`/verify/[code]`)

- Interface pública para verificação
- Formulário de busca por código
- Exibição detalhada de certificados válidos
- Mensagens de erro para certificados inválidos

## Funcionalidades Especiais

### 1. Geração de Códigos Únicos

- **Número do Certificado**: Formato `CERT-XXXXXXXX-XXXX`
- **Código de Verificação**: 8 caracteres alfanuméricos únicos

### 2. Sistema de Validação

- **Validade**: Certificados podem ser marcados como válidos/inválidos
- **Expiração**: Data de validade opcional
- **Verificação em Tempo Real**: Status atualizado dinamicamente

### 3. Integração com Gamificação

- Atualização automática do contador de certificados do usuário
- Sincronização com sistema de badges e XP

## Estilos e Design

O módulo segue os padrões de design do projeto:

- **Tailwind CSS**: Utiliza classes utilitárias do Tailwind
- **Shadcn/UI**: Componentes consistentes com o design system
- **Dark Mode**: Suporte completo ao modo escuro
- **Responsividade**: Interface adaptável para todos os dispositivos
- **Ícones Tabler**: Ícones consistentes em toda a interface

## Validações

### Schemas Zod

- **CreateCertificateSchema**: Validação para criação
- **UpdateCertificateSchema**: Validação para atualização
- **CertificateFiltersSchema**: Validação de filtros
- **CertificateVerificationSchema**: Validação de verificação

## Próximos Passos

### Funcionalidades Futuras

1. **Geração de PDFs**: Implementar geração real de PDFs
2. **Templates Personalizáveis**: Sistema de templates para certificados
3. **Assinatura Digital**: Implementar assinatura digital nos certificados
4. **Notificações**: Envio automático de certificados por email
5. **Relatórios**: Relatórios avançados de certificados emitidos
6. **Integração com Blockchain**: Verificação via blockchain

### Melhorias Técnicas

1. **Cache**: Implementar cache para consultas frequentes
2. **Rate Limiting**: Limitar verificações públicas
3. **Logs**: Sistema de logs para auditoria
4. **Backup**: Sistema de backup de certificados
5. **API Rate Limiting**: Proteção contra abuso da API

## Como Usar

### Para Administradores

1. Acesse `/admin/dashboard/certificates`
2. Use "Criar Certificado" para emitir novos certificados
3. Gerencie certificados existentes através da interface
4. Monitore estatísticas em tempo real

### Para Usuários Públicos

1. Acesse `/verify/[código]` ou `/verify`
2. Digite o código de verificação do certificado
3. Visualize as informações do certificado válido

## Segurança

- Códigos de verificação únicos e seguros
- Validação de entrada em todas as APIs
- Controle de acesso baseado em roles
- Proteção contra SQL injection
- Validação de dados com Zod
