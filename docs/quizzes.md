# Sistema de Quizzes - Kudondza

## Visão Geral

O sistema de quizzes do Kudondza permite que administradores e instrutores criem, gerenciem e monitorem avaliações interativas para os alunos. O sistema suporta diversos tipos de questões e oferece funcionalidades avançadas de gamificação.

## Funcionalidades Principais

### 1. Gerenciamento de Quizzes

- **Criar Quiz**: Criação de novos quizzes com configurações personalizáveis
- **Editar Quiz**: Modificação de quizzes existentes
- **Deletar Quiz**: Remoção segura de quizzes (apenas se não houver tentativas)
- **Visualizar Quiz**: Interface detalhada para visualizar configurações e questões

### 2. Tipos de Questões Suportados

- **Múltipla Escolha**: Uma resposta correta entre várias opções
- **Múltipla Seleção**: Múltiplas respostas corretas
- **Verdadeiro/Falso**: Questões binárias
- **Resposta Curta**: Respostas textuais breves
- **Dissertativa**: Respostas longas e detalhadas
- **Código**: Questões relacionadas a programação
- **Ordenação**: Sequenciamento de itens

### 3. Configurações Avançadas

- **Limite de Tempo**: Definição de tempo máximo para conclusão
- **Pontuação para Aprovação**: Percentual mínimo para aprovação
- **Máximo de Tentativas**: Número máximo de tentativas permitidas
- **Embaralhar Questões**: Opção para randomizar ordem das questões
- **Mostrar Resultados**: Controle sobre exibição de resultados
- **Recompensa de XP**: Pontos de experiência ganhos ao completar

### 4. Sistema de Gamificação

- **XP Rewards**: Sistema de pontos por conclusão
- **Badges**: Conquistas por performance
- **Leaderboards**: Rankings de alunos
- **Progress Tracking**: Acompanhamento de evolução

## Estrutura de Arquivos

```
src/
├── actions/quizzes/           # Server Actions para CRUD
│   ├── index.ts              # Exportações
│   ├── create-quiz.ts        # Criar quiz
│   ├── get-quizzes.ts        # Buscar quizzes
│   ├── get-quiz.ts           # Buscar quiz específico
│   ├── update-quiz.ts        # Atualizar quiz
│   ├── delete-quiz.ts        # Deletar quiz
│   ├── create-question.ts    # Criar questão
│   ├── update-question.ts    # Atualizar questão
│   ├── delete-question.ts    # Deletar questão
│   └── reorder-questions.ts  # Reordenar questões
├── app/(admin)/admin/dashboard/quizzes/
│   ├── page.tsx              # Lista principal de quizzes
│   ├── layout.tsx            # Layout da seção
│   ├── [quizId]/
│   │   ├── page.tsx          # Visualização do quiz
│   │   └── edit/
│   │       └── page.tsx      # Edição do quiz
│   └── _components/          # Componentes reutilizáveis
│       ├── types.ts          # Tipos TypeScript
│       ├── quizzes-list.tsx  # Lista principal
│       ├── quiz-stats.tsx    # Estatísticas
│       ├── quiz-filters.tsx  # Filtros de busca
│       ├── quiz-upsert-form.tsx # Formulário de criação
│       ├── quizzes-table.tsx # Tabela de quizzes
│       ├── quiz-view.tsx     # Visualização detalhada
│       ├── question-list.tsx # Lista de questões
│       └── question-editor.tsx # Editor de questões
```

## Como Usar

### 1. Acessar a Seção de Quizzes

- Navegue para `/admin/dashboard/quizzes`
- A página principal exibe todos os quizzes disponíveis

### 2. Criar um Novo Quiz

- Clique no botão "Criar Quiz"
- Preencha as informações básicas:
  - Título e descrição
  - Seleção do módulo
  - Configurações de tempo e pontuação
  - Opções de gamificação

### 3. Adicionar Questões

- Após criar o quiz, clique em "Adicionar Questão"
- Escolha o tipo de questão
- Configure as opções e respostas corretas
- Defina a pontuação

### 4. Gerenciar Quizzes Existentes

- Use os filtros para encontrar quizzes específicos
- Visualize estatísticas e detalhes
- Edite configurações conforme necessário
- Monitore tentativas dos alunos

## Configurações Recomendadas

### Para Quizzes Básicos

- **Tempo**: 15-30 minutos
- **Aprovação**: 70%
- **Tentativas**: 2-3
- **XP**: 100 pontos

### Para Quizzes Avançados

- **Tempo**: 45-60 minutos
- **Aprovação**: 80-85%
- **Tentativas**: 1-2
- **XP**: 150-200 pontos

### Para Avaliações Finais

- **Tempo**: 90-120 minutos
- **Aprovação**: 75-80%
- **Tentativas**: 1
- **XP**: 300-500 pontos

## Boas Práticas

### 1. Criação de Questões

- Use linguagem clara e objetiva
- Evite ambiguidades nas respostas
- Balanceie a dificuldade das questões
- Inclua explicações para respostas incorretas

### 2. Configuração de Quizzes

- Defina limites de tempo realistas
- Configure pontuação adequada ao nível
- Use embaralhamento para evitar cola
- Monitore estatísticas regularmente

### 3. Gamificação

- Defina recompensas proporcionais à dificuldade
- Crie sequências de quizzes progressivos
- Celebre conquistas dos alunos
- Mantenha o sistema engajante

## Troubleshooting

### Problemas Comuns

1. **Quiz não aparece na lista**

   - Verifique se o módulo está ativo
   - Confirme permissões de acesso
   - Recarregue a página

2. **Erro ao criar questão**

   - Verifique se todas as opções estão preenchidas
   - Confirme se há pelo menos uma resposta correta
   - Valide o tipo de questão selecionado

3. **Problemas de performance**
   - Limite o número de questões por quiz
   - Use filtros para buscar quizzes específicos
   - Implemente paginação para grandes volumes

### Suporte Técnico

Para problemas técnicos ou dúvidas:

- Consulte a documentação da API
- Verifique os logs do servidor
- Entre em contato com a equipe de desenvolvimento

## Roadmap

### Funcionalidades Futuras

- [ ] Importação/exportação de quizzes
- [ ] Templates de questões pré-definidos
- [ ] Sistema de revisão por pares
- [ ] Analytics avançados
- [ ] Integração com IA para correção
- [ ] Quizzes adaptativos
- [ ] Sistema de feedback em tempo real

### Melhorias Planejadas

- [ ] Interface mobile otimizada
- [ ] Temas visuais personalizáveis
- [ ] Integração com calendário
- [ ] Notificações automáticas
- [ ] Backup e restauração
- [ ] Versionamento de quizzes
