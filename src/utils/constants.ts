export const ROLES = {
  ADMIN: 'admin',
  SUPERVISOR: 'supervisor',
  STOREKEEPER: 'storekeeper',
} as const;

export const MOVEMENT_TYPES = {
  IN: 'in',
  OUT: 'out',
} as const;

export const ALERT_TYPES = {
  LOW_STOCK: 'low_stock',
  EXPIRATION: 'expiration',
  PRICE_CHANGE: 'price_change',
  SYSTEM: 'system',
} as const;

export const ALERT_SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

export const UNITS = [
  { value: 'un', label: 'Unidade' },
  { value: 'kg', label: 'Quilograma' },
  { value: 'l', label: 'Litro' },
  { value: 'm', label: 'Metro' },
  { value: 'm2', label: 'Metro Quadrado' },
  { value: 'm3', label: 'Metro Cúbico' },
  { value: 'cx', label: 'Caixa' },
  { value: 'pc', label: 'Pacote' },
] as const;