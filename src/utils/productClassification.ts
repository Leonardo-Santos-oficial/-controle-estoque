import * as natural from 'natural';
import { removeStopwords } from 'stopword';

interface ProductFeatures {
  name: string;
  description: string;
  characteristics?: string[];
}

interface Category {
  id: string;
  name: string;
  keywords: string[];
  parentId?: string;
}

// Categorias predefinidas (pode ser expandido ou carregado de um banco de dados)
const defaultCategories: Category[] = [
  {
    id: 'esquadrias',
    name: 'Esquadrias de Alumínio',
    keywords: [
      'perfil', 'alumínio', 'esquadria', 'janela', 'porta', 'vidro', 'fechadura',
      'dobradiça', 'trilho', 'roldana', 'puxador', 'guarnição', 'batente',
      'veneziana', 'persiana', 'basculante', 'pivotante', 'correr', 'maxim-ar'
    ]
  },
  {
    id: 'limpeza_fachada',
    name: 'Limpeza de Fachada',
    keywords: [
      'detergente', 'limpa vidro', 'produto', 'limpeza', 'removedor',
      'selante', 'silicone', 'escova', 'raspador', 'espátula', 'hidrojato',
      'equipamento', 'EPI', 'corda', 'cadeirinha', 'balancim', 'andaime'
    ]
  },
  {
    id: 'vidros',
    name: 'Vidros',
    keywords: [
      'vidro', 'temperado', 'laminado', 'comum', 'blindex', 'box',
      'espelho', 'película', 'insulfilm', 'vedação', 'borracha',
      'silicone', 'ventosa', 'kit', 'ferragem', 'suporte'
    ]
  },
  {
    id: 'portas_automaticas',
    name: 'Portas Automáticas',
    keywords: [
      'motor', 'automatizador', 'controle', 'remoto', 'sensor',
      'cremalheira', 'corrente', 'correia', 'placa', 'central',
      'rolamento', 'engrenagem', 'fim de curso', 'portão', 'deslizante',
      'basculante', 'pivotante', 'batente'
    ]
  },
  {
    id: 'automacao',
    name: 'Automação e Câmeras',
    keywords: [
      'câmera', 'CFTV', 'DVR', 'NVR', 'cabo', 'fonte', 'conector',
      'sensor', 'alarme', 'controle', 'acesso', 'fechadura', 'elétrica',
      'biometria', 'interfone', 'vídeo porteiro', 'monitor', 'gravador'
    ]
  },
  {
    id: 'ferramentas',
    name: 'Ferramentas e Equipamentos',
    keywords: [
      'ferramenta', 'chave', 'alicate', 'furadeira', 'parafusadeira',
      'serra', 'marreta', 'martelo', 'nível', 'trena', 'esquadro',
      'broca', 'disco', 'lixadeira', 'rebitadeira', 'esmerilhadeira'
    ]
  },
  {
    id: 'fixacao',
    name: 'Materiais de Fixação',
    keywords: [
      'parafuso', 'bucha', 'porca', 'arruela', 'rebite', 'grampo',
      'abraçadeira', 'suporte', 'cantoneira', 'fixador', 'presilha',
      'chumbador', 'ancora', 'fita', 'cola', 'adesivo'
    ]
  },
  {
    id: 'acabamento',
    name: 'Acabamentos',
    keywords: [
      'pintura', 'tinta', 'verniz', 'selador', 'massa', 'primer',
      'silicone', 'vedante', 'fita', 'perfil', 'acabamento',
      'baguete', 'arremate', 'guarnição', 'moldura', 'cantoneira'
    ]
  }
];

class ProductClassifier {
  private tokenizer: natural.WordTokenizer;
  private categories: Category[];
  private classifier: natural.BayesClassifier;

  constructor(categories: Category[] = defaultCategories) {
    this.tokenizer = new natural.WordTokenizer();
    this.categories = categories;
    this.classifier = new natural.BayesClassifier();

    // Treinar o classificador com as palavras-chave das categorias
    this.trainClassifier();
  }

  private preprocessText(text: string): string[] {
    // Converter para minúsculas
    const lowercased = text.toLowerCase();
    
    // Tokenização
    const tokens = this.tokenizer.tokenize(lowercased) || [];
    
    // Remover stopwords
    const withoutStopwords = removeStopwords(tokens);
    
    return withoutStopwords;
  }

  private trainClassifier(): void {
    // Treinar com as palavras-chave de cada categoria
    this.categories.forEach(category => {
      category.keywords.forEach(keyword => {
        this.classifier.addDocument(this.preprocessText(keyword), category.id);
      });
    });

    this.classifier.train();
  }

  public classifyProduct(product: ProductFeatures): {
    categoryId: string;
    confidence: number;
    suggestedCategories: Array<{ id: string; confidence: number }>;
  } {
    // Combinar todas as características do produto em um texto
    const combinedText = [
      product.name,
      product.description,
      ...(product.characteristics || [])
    ].join(' ');

    // Pré-processar o texto
    const processedText = this.preprocessText(combinedText);

    // Classificar o produto
    const classifications = this.classifier.getClassifications(processedText);

    // Ordenar por confiança
    const sortedClassifications = classifications.sort((a, b) => b.value - a.value);

    // Retornar a categoria principal e sugestões alternativas
    return {
      categoryId: sortedClassifications[0].label,
      confidence: sortedClassifications[0].value,
      suggestedCategories: sortedClassifications.map(c => ({
        id: c.label,
        confidence: c.value
      }))
    };
  }

  public getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Sem categoria';
  }

  // Método para adicionar novas categorias e retreinar o classificador
  public addCategory(category: Category): void {
    this.categories.push(category);
    category.keywords.forEach(keyword => {
      this.classifier.addDocument(this.preprocessText(keyword), category.id);
    });
    this.classifier.train();
  }
}

// Singleton instance
let classifierInstance: ProductClassifier | null = null;

export function getProductClassifier(): ProductClassifier {
  if (!classifierInstance) {
    classifierInstance = new ProductClassifier();
  }
  return classifierInstance;
}

export function classifyNewProduct(product: ProductFeatures) {
  const classifier = getProductClassifier();
  const result = classifier.classifyProduct(product);
  
  // Log para depuração
  console.log('Entrada da classificação:', product);
  console.log('Resultado da classificação:', result);
  
  return result;
}

export function getCategoryName(categoryId: string): string {
  const classifier = getProductClassifier();
  return classifier.getCategoryName(categoryId);
}
