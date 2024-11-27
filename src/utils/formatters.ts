import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
};

export const formatDateTime = (date: Date): string => {
  return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
};

export const formatQuantity = (value: number, unit: string): string => {
  return `${value} ${unit}`;
};