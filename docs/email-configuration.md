# Configuração de Email

O sistema agora usa **Nodemailer** para envio de emails, com configurações diferentes para desenvolvimento e produção.

## Desenvolvimento (Local)

Em desenvolvimento, o sistema usa **Ethereal Email** automaticamente:

- Não precisa de configuração
- Todos os emails ficam "presos" no Ethereal
- Você recebe um link de preview para ver o email
- Ilimitado para testes

## Produção

Para produção, configure as seguintes variáveis de ambiente:

```env
# SMTP Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM_EMAIL="noreply@kudondza.com"
```

## Provedores SMTP Recomendados

### Gmail

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
```

**Nota:** Use "App Password" do Gmail, não sua senha normal.

### Outlook/Hotmail

```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_SECURE="false"
```

### SendGrid

```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_SECURE="false"
```

### Mailgun

```env
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_SECURE="false"
```

## Como Funciona

1. **Desenvolvimento**: Sistema detecta `NODE_ENV=development` e usa Ethereal
2. **Produção**: Sistema usa as configurações SMTP fornecidas
3. **Logs**: Todos os envios são logados no console
4. **Preview**: Em desenvolvimento, você recebe um link para ver o email

## Testando

Para testar o sistema:

1. Em desenvolvimento: Registre um usuário e veja o link de preview no console
2. Em produção: Configure as variáveis SMTP e teste o registro

## Vantagens

- ✅ **Desenvolvimento**: Sem limitações, preview fácil
- ✅ **Produção**: Controle total sobre o provedor SMTP
- ✅ **Flexibilidade**: Pode usar qualquer provedor SMTP
- ✅ **Custo**: Muitos provedores SMTP são mais baratos que Resend
- ✅ **Sem domínio**: Não precisa de domínio próprio para testar
