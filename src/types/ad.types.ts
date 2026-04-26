export interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdDto {
  title: string;
  description: string;
  price: number;
  category: string;
  images: File[];
}
