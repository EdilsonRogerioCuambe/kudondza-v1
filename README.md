# Kudondza - Plataforma de Educação

Este é um projeto [Next.js](https://nextjs.org) para uma plataforma de educação com suporte a upload de arquivos usando Cloudflare R2.

## 🚀 Configuração Inicial

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- Conta no Cloudflare (para R2 Object Storage)

### Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd kudondza-v1
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env.local
```

4. Configure o Cloudflare R2 (veja seção abaixo)

5. Execute as migrações do banco:

```bash
npx prisma migrate dev
```

6. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## ☁️ Configuração do Cloudflare R2

Este projeto usa o Cloudflare R2 para armazenamento de arquivos. Siga as instruções em [R2_SETUP.md](./R2_SETUP.md) para configurar:

1. **Criar bucket R2** no Cloudflare Dashboard
2. **Configurar API Token** com permissões adequadas
3. **Adicionar variáveis de ambiente** no arquivo `.env.local`

### Variáveis de Ambiente Necessárias

```env
# Cloudflare R2 Configuration
R2_ACCOUNT_ID="your-cloudflare-account-id"
R2_ACCESS_KEY_ID="your-r2-access-key-id"
R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
R2_BUCKET_NAME="kudondza"
R2_ENDPOINT_URL="https://your-account-id.r2.cloudflarestorage.com"
R2_REGION="auto"
NEXT_PUBLIC_R2_BUCKET_NAME="kudondza"
```

### Testar Conexão R2

Execute o script de teste para verificar se a configuração está correta:

```bash
node test-r2-connection.js
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Constrói para produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa ESLint

# Banco de dados
npm run db:generate  # Gera cliente Prisma
npm run db:push      # Aplica schema ao banco
npm run db:studio    # Abre Prisma Studio
```

## 📁 Estrutura do Projeto

```
src/
├── actions/         # Server actions
├── app/            # App router (Next.js 13+)
├── components/     # Componentes React
├── lib/           # Utilitários e configurações
├── providers/     # Providers React
└── hooks/         # Custom hooks
```

## 🔧 Funcionalidades

- **Upload de Arquivos**: Suporte a imagens, vídeos e documentos
- **URLs Pré-assinadas**: Acesso seguro aos arquivos
- **Bucket Privado**: Armazenamento seguro
- **Autenticação**: Sistema de autenticação completo
- **Editor Markdown**: Editor rico para conteúdo

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no dashboard
3. Deploy automático a cada push

### Outras Plataformas

Certifique-se de configurar todas as variáveis de ambiente necessárias na plataforma escolhida.

## 📚 Documentação

- [R2_SETUP.md](./R2_SETUP.md) - Configuração detalhada do Cloudflare R2
- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
