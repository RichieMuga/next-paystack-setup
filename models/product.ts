export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category?: string;
  stock?: number;
}

export const getProducts = (): Product[] => {
  return [
    {
      id: 'prod_1',
      name: 'Premium Headphones',
      price: 25000,
      description: 'High-quality wireless headphones',
      image: '🎧',
      category: 'Electronics',
      stock: 50
    },
    {
      id: 'prod_2',
      name: 'Wireless Mouse',
      price: 3500,
      description: 'Ergonomic wireless mouse',
      image: '🖱️',
      category: 'Electronics',
      stock: 100
    }
  ];
};

export const getProductById = (id: string): Product | undefined => {
  return getProducts().find(p => p.id === id);
};