// src/app/article/article.model.ts

export interface Article {
  id: string | number;
  title: string;
  author: string;
  createdAt: string; // e.g. '2025/08/21'
  content?: string;
  tags?: string[];
  sheetName?: string;
  status: 'draft' | 'published' | 'unpublished';
}
