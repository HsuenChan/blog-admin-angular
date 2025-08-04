// src/app/article/article.model.ts

export interface Article {
  id: number;
  title: string;
  author: string;
  createdAt: Date;
  content: string;
  tags: string[];
  status: 'draft' | 'published';
}
