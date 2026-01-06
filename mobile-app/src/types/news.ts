export interface NewsData {
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
  
export interface NewsMetadata {
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface News {
  data: [NewsData];
  meta?: NewsMetadata;
}