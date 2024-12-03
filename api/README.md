# Sistema de Previsão de Demanda

Este sistema utiliza Machine Learning para prever a demanda futura de produtos baseado no histórico de vendas.

## Funcionalidades

- Previsão de demanda por produto
- Sugestão de quantidade para próximo pedido
- Análise de tendências
- Previsões em lote para múltiplos produtos
- Interface visual com gráficos

## Configuração do Ambiente

### Backend (Python)

1. Crie um ambiente virtual:
```bash
python -m venv venv
```

2. Ative o ambiente virtual:
```bash
# Windows
venv\Scripts\activate
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Execute a API:
```bash
python main.py
```

A API estará disponível em http://localhost:3001

### Frontend

O componente de previsão de demanda já está integrado ao seu sistema existente. Certifique-se de que as dependências do frontend estão instaladas:

```bash
npm install recharts
```

## Uso

1. Envie dados históricos de vendas através da API:
   - POST /api/sales-data

2. Obtenha previsões:
   - GET /api/forecast/{product_id}
   - POST /api/batch-forecast

3. Visualize as previsões no componente React DemandForecastView

## Modelo de Machine Learning

O sistema utiliza Random Forest Regression para fazer as previsões, considerando:
- Sazonalidade
- Tendências
- Padrões diários/semanais
- Histórico de vendas

## Próximos Passos

1. Adicionar mais features ao modelo:
   - Eventos especiais
   - Feriados
   - Promoções
   - Fatores externos

2. Implementar validação cruzada
3. Adicionar mais métricas de confiança
4. Implementar sistema de feedback para melhorar as previsões
