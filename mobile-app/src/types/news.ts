export interface News {
    id: number;
    title: string;
    imageUrl?: string;
    publishedAt?: string;
    source?: string;
    sourceLogoUrl?: string;
    category?: {
      id: number;
      name: string;
    };
  }
  