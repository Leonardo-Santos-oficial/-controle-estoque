const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/analyze-inventory', async (req, res) => {
  try {
    const { inventoryData } = req.body;
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Você é um assistente especializado em análise de estoque para empresas prestadoras de serviços. Você analisa o uso de peças e materiais em serviços e manutenções, não vendas diretas. Considere padrões de uso em serviços, peças críticas, e impacto na continuidade dos serviços. Responda em português."
        },
        {
          role: "user",
          content: `Analise estes dados de inventário para nossa operação de serviços e forneça insights relevantes: ${JSON.stringify(inventoryData)}. Considere:
          1. Padrões de uso das peças nos serviços
          2. Identificação de peças críticas para a continuidade dos serviços
          3. Sugestões para otimizar o estoque baseado no histórico de serviços
          4. Riscos potenciais para a operação`
        }
      ],
      model: "gpt-3.5-turbo",
    });
    res.json({ result: completion.choices[0].message.content });
  } catch (error) {
    console.error('Erro ao analisar inventário:', error);
    res.status(500).json({ error: 'Erro ao analisar inventário' });
  }
});

app.post('/api/predict-stock-levels', async (req, res) => {
  try {
    const { productData } = req.body;
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Você é um assistente especializado em gestão de estoque para empresas prestadoras de serviços. O estoque é utilizado para realização de serviços e manutenções, não para venda direta. Considere fatores como: frequência de serviços que usam cada peça, tempo médio de cada serviço, sazonalidade da demanda, e criticidade das peças para os serviços. Todas as suas análises e recomendações devem ser em DIAS. Responda em português."
        },
        {
          role: "user",
          content: `Analise esses dados e forneça recomendações específicas sobre níveis de estoque para nossa operação de serviços. Considere que as peças são usadas em serviços/manutenções, não vendidas diretamente: ${JSON.stringify(productData)}. Inclua: 
          1. Nível recomendado de estoque considerando a frequência de uso em serviços
          2. Ponto de ressuprimento baseado no tempo médio de entrega e criticidade para os serviços
          3. Sugestões para evitar paradas de serviço por falta de peças
          Mantenha todas as recomendações de tempo em DIAS.`
        }
      ],
      model: "gpt-3.5-turbo",
    });
    res.json({ result: completion.choices[0].message.content });
  } catch (error) {
    console.error('Erro ao prever níveis de estoque:', error);
    res.status(500).json({ error: 'Erro ao prever níveis de estoque' });
  }
});

app.post('/api/categorize-product', async (req, res) => {
  try {
    const { productInfo } = req.body;
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Você é um assistente de categorização de produtos. Responda todas as perguntas e análises em português."
        },
        {
          role: "user",
          content: `Por favor, categorize este produto com base nas informações: ${JSON.stringify(productInfo)}`
        }
      ],
      model: "gpt-3.5-turbo",
    });
    res.json({ result: completion.choices[0].message.content });
  } catch (error) {
    console.error('Erro ao categorizar produto:', error);
    res.status(500).json({ error: 'Erro ao categorizar produto' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});
