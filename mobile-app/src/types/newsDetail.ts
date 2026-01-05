export interface NewsDetail {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  publishedAt: string;
  source: string;
  sourceLogoUrl: string;
  category: {
    id: number;
    name: string;
  };
}
