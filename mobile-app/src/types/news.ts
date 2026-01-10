export interface NewsData {
    id: number;
    title: string;
    imageUrl?: string;
    publishedAt?: string;
    source?: {
      id: number;
      name: string;
      logoUrl: string;
    };
    category?: {
      id: number;
      name: string;
    };
  }
  
export interface NewsMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: NewsMetadata;
}

export interface HighlightResponse {
  data: NewsData[];
}

export type NewsType =
  | "all"
  | "breaking"
  | "recommendations"
  | "breaking-highlight"
  | "recommendations-highlight";
