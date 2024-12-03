# Sistema de Controle de Estoque com IA

Este é um sistema moderno de controle de estoque que combina tecnologias web avançadas com inteligência artificial para fornecer uma solução robusta e inteligente de gerenciamento de inventário.

## 🚀 Funcionalidades Principais

### 1. Gestão de Produtos
- **Cadastro de Produtos**
  - Adição de novos produtos com informações detalhadas
  - Upload de imagens dos produtos
  - Categorização e etiquetagem
  - Definição de níveis de estoque mínimo

- **Visualização e Edição**
  - Lista completa de produtos com filtros avançados
  - Edição rápida de informações
  - Histórico de alterações
  - Visualização detalhada de cada produto

### 2. Controle de Estoque
- **Movimentações**
  - Registro de entradas e saídas
  - Transferências entre locais
  - Ajustes de inventário
  - Histórico completo de movimentações

- **Monitoramento em Tempo Real**
  - Dashboard interativo
  - Gráficos de movimentação
  - Indicadores de performance (KPIs)
  - Alertas de estoque baixo

### 3. Inteligência Artificial e Analytics

#### 3.1 Detecção de Anomalias
- **Monitoramento Inteligente**
  - Identificação automática de padrões suspeitos
  - Detecção de movimentações atípicas
  - Alertas em tempo real
  - Análise histórica de anomalias

- **Tipos de Anomalias Detectadas**
  - Quantidades incomuns em movimentações
  - Padrões suspeitos de entrada/saída
  - Frequência atípica de movimentações
  - Variações significativas de preço

#### 3.2 Analytics Avançado
- **Relatórios Inteligentes**
  - Previsão de demanda
  - Análise de tendências
  - Sugestões de reposição
  - Identificação de produtos com baixo giro

### 4. Interface do Usuário

#### 4.1 Dashboard Principal
- **Visão Geral**
  - Total de produtos
  - Valor total do estoque
  - Movimentações recentes
  - Alertas e notificações

- **Seção de Anomalias**
  - Lista de anomalias detectadas
  - Detalhes de cada ocorrência
  - Filtros e ordenação
  - Ações rápidas para tratamento

#### 4.2 Gerenciamento de Produtos
- **Lista de Produtos**
  - Busca avançada
  - Filtros personalizados
  - Ordenação múltipla
  - Ações em lote

- **Detalhes do Produto**
  - Informações completas
  - Histórico de movimentações
  - Gráficos de evolução
  - Indicadores específicos

## ✨ Novas Funcionalidades

### 🔍 Classificação Automática de Produtos
- Classificação inteligente de produtos usando processamento de linguagem natural (NLP)
- Suporte a categorias predefinidas
- Níveis de confiança para classificação
- Sugestões de categorias alternativas

### 📦 Gerenciamento de Produtos
- Filtros avançados de produtos:
  - Busca por nome ou SKU
  - Filtro por status (Ativo/Inativo)
  - Filtro por categoria
- Ações de produto:
  - Edição de detalhes
  - Ativação/Desativação de produtos
  - Remoção de produtos
- Indicadores visuais de status do produto

## 🛠 Tecnologias Utilizadas

### Frontend
- **React** - Framework principal
- **TypeScript** - Linguagem de programação
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **React Icons** - Ícones
- **date-fns** - Manipulação de datas

### Backend
- **Firebase**
  - Firestore (banco de dados)
  - Authentication (autenticação)
  - Storage (armazenamento de arquivos)

### Inteligência Artificial
- **Isolation Forest** - Algoritmo de detecção de anomalias
- **Machine Learning** - Análise preditiva
- **Natural Language Processing (NLP)** - Classificação automática de produtos

## 📦 Estrutura do Projeto

```
src/
├── components/         # Componentes reutilizáveis
├── pages/             # Páginas da aplicação
│   ├── Dashboard.tsx  # Dashboard principal
│   └── ...
├── store/             # Gerenciamento de estado
│   └── useInventoryStore.ts
├── utils/             # Utilitários
│   ├── anomalyDetection.mjs  # Detecção de anomalias
│   └── ...
└── services/          # Serviços externos
    └── activityService.ts
```

## 🚀 Como Executar o Projeto

1. **Pré-requisitos**
   ```bash
   node.js >= 14.0.0
   npm ou yarn
   ```

2. **Instalação**
   ```bash
   # Clone o repositório
   git clone [URL_DO_REPOSITORIO]

   # Instale as dependências
   npm install
   ```

3. **Configuração**
   - Configure as variáveis de ambiente no arquivo `.env`
   - Configure o Firebase no arquivo de configuração

4. **Execução**
   ```bash
   # Modo desenvolvimento
   npm run dev

   # Build para produção
   npm run build
   ```

## 🔒 Segurança

- Autenticação de usuários via Firebase
- Controle de acesso baseado em roles
- Proteção contra ataques comuns
- Validação de dados em tempo real

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Notas de Desenvolvimento

### Detecção de Anomalias
O sistema utiliza o algoritmo Isolation Forest para detectar anomalias nas movimentações de estoque. O processo inclui:

1. **Coleta de Dados**
   - Movimentações de estoque
   - Timestamps
   - Quantidades

2. **Processamento**
   - Normalização dos dados
   - Análise temporal
   - Identificação de padrões

3. **Alertas**
   - Notificações em tempo real
   - Dashboard dedicado
   - Registro de ocorrências

### Performance
- Otimização de consultas ao Firestore
- Lazy loading de componentes
- Caching de dados frequentes
- Compressão de imagens

## 📈 Roadmap

### Próximas Funcionalidades
1. Integração com sistemas externos
2. API REST para terceiros
3. App mobile
4. Relatórios personalizados
5. Machine Learning avançado

## 📞 Suporte

Para suporte e dúvidas, entre em contato através de:
- Email: [seu-email@exemplo.com]
- Issues do GitHub
- Discord: [link-do-servidor]

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).
