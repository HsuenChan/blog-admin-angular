import { Injectable } from '@angular/core';
import { Article } from './article.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private articles: Article[] = [
    {
      id: 1,
      title: 'Angular 教學入門',
      author: '小明',
      createdAt: new Date('2025-08-01'),
      content: '這是一篇 Angular 教學文章。',
      tags: ['angular', 'frontend'],
      status: 'published'
    },
    {
      id: 2,
      title: 'Angular 新手入門',
      author: '小華',
      createdAt: new Date('2024-07-15'),
      content: 'Angular 新手入門怎麼那麼難',
      tags: ['angular', 'stream', 'rxjs'],
      status: 'draft'
    }
  ];
  private articleSubject = new BehaviorSubject<Article[]>(this.articles);

  getAll(): Observable<Article[]> {
    return this.articleSubject.asObservable();
  }

  delete(id: number) {
    this.articles = this.articles.filter(a => a.id !== id);
    this.articleSubject.next(this.articles);
  }

  getById(id: number): Article | undefined {
    return this.articles.find(a => a.id === id);
  }

  update(updated: Article) {
    const index = this.articles.findIndex(a => a.id === updated.id);
    if (index !== -1) {
      this.articles[index] = updated;
      this.articleSubject.next(this.articles);
    }
  }

  create(article: Article) {
    this.articles.push(article);
    this.articleSubject.next(this.articles);
  }
}
