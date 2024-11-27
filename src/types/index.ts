export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'storekeeper';
  avatar?: string;
  department?: string;
  lastLogin?: Date;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  unit: string;
  minQuantity: number;
  currentQuantity: number;
  supplier: string;
  price: number;
  lastPurchaseDate?: Date;
  lastPurchasePrice?: number;
  imageUrl?: string;
  status: 'active' | 'inactive';
  location: {
    sector: string;
    shelf: string;
    position: string;
  };
  qrCode?: string;
  barcode?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Movement = {
  id: string;
  productId: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  userId: string;
  documentNumber?: string;
  documentUrl?: string;
  cost?: number;
  department?: string;
  requestedBy?: string;
  approvedBy?: string;
  notes?: string;
  timestamp: Date;
};

export type Alert = {
  id: string;
  type: 'low_stock' | 'expiration' | 'price_change' | 'system';
  productId?: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
};

export type Supplier = {
  id: string;
  name: string;
  cnpj: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  products: string[];
  rating: number;
  lastPurchase?: Date;
  notes?: string;
};