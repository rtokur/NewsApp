export interface NewsDetail {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  publishedAt: string;
  source: {
    id: number;
    name: string;
    logoUrl: string;
  };
  category: {
    id: number;
    name: string;
  };
}
