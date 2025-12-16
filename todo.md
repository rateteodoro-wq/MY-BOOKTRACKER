# Book Writing Tracker - TODO

## Banco de Dados
- [x] Tabela `books` (título, meta de capítulos, data de criação)
- [x] Tabela `chapters` (número, título, status, porcentagem, notas)
- [x] Tabela `sessions` (data, duração, modo, notas capturadas, capítulo)
- [x] Tabela `rituals` (tipo, data, checklist items, concluído)
- [x] Tabela `milestones` (descrição, data, tipo de celebração)
- [x] Tabela `atomic_notes` (conteúdo, data, capítulo associado)

## Backend (tRPC Procedures)
- [x] Procedures para CRUD de capítulos
- [x] Procedures para criar/atualizar sessões de trabalho
- [x] Procedures para gerenciar rituais e checklists
- [x] Procedures para registrar marcos/celebrações
- [x] Procedures para listar histórico de sessões
- [x] Procedures para integração com LLM (sugestões, revisão)
- [ ] Procedures para notificações por email (lembretes automáticos)

## Frontend - Páginas
- [x] Dashboard principal (visão geral de progresso)
- [x] Página de Modo Manutenção (segunda-quinta)
- [x] Página de Modo Construção (finais de semana)
- [x] Página de Configurações (meta de capítulos, título do livro, notificações)
- [x] Página de Histórico de Sessões
- [x] Página de Marcos/Celebrações

## Frontend - Componentes
- [ ] Componente de Timer (50min para Manutenção, 90min para Construção)
- [ ] Componente de Checklist (Ritual de Entrada/Saída)
- [ ] Componente de Progresso de Capítulo (barra visual)
- [ ] Componente de Card de Sessão (histórico)
- [ ] Componente de Pausa Regenerativa (20min para Construção)
- [ ] Componente de Shutdown Ritual (checklists específicos)

## Design Visual
- [x] Implementar estilo Internacional (branco, vermelho, preto, grid)
- [x] Tipografia sans-serif nítida com hierarquia clara
- [x] Linhas divisórias pretas finas
- [x] Espaço negativo generoso
- [x] Layout assimétrico baseado em grid dinâmico

## Notificações e Automação
- [ ] Configurar lembretes automáticos por email (19:00 dias de semana, 06:45 finais de semana)
- [ ] Sistema de notificações in-app para rituais
- [ ] Integração com email para envio de lembretes

## Integração com IA (LLM)
- [x] Sugestões de continuação de texto baseadas em contexto
- [x] Revisão de parágrafos escritos
- [x] Geração de ideias baseadas em notas atômicas
- [x] Interface para interagir com sugestões da IA

## Testes
- [x] Testes vitest para procedures de capítulos
- [x] Testes vitest para procedures de sessões (auth.logout)
- [x] Testes vitest para procedures de livro (book.update)
- [ ] Testes vitest para procedures de rituais
- [ ] Testes vitest para integração com LLM

## Correções de Bugs
- [x] Erro de query undefined na procedure book.get
- [x] Tratamento de erros no Dashboard
- [x] Funções de banco de dados retornando valores corretos
- [x] Funcionalidade de salvar alterações do livro (nome e capítulos) na página de Configurações

## Entrega
- [ ] Checkpoint final
- [ ] Documentação de uso
- [ ] Link de acesso ao aplicativo

## Melhorias de UI/UX
- [x] Remover header do Dashboard (já existe Sidebar no Layout)
- [x] Corrigir layout dos cards para acomodar melhor o texto
- [x] Adicionar card de total de palavras escritas no livro

## Bugs a Corrigir
- [x] Restaurar botão de Configurações no Dashboard (navegação desapareceu ao remover header)

- [x] Corrigir roteamento: clique em Dashboard a partir de Gerenciar Capítulos retorna à página inicial
