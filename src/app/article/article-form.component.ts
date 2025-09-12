import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ArticleService } from './article.service';
import { Article } from './article.model';
import { CommonModule } from '@angular/common';
import { GoogleSheetsService } from './google-sheets.service';
// material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

// @Component 是 Angular 中的裝飾器，用來定義一個元件（Component）
@Component({
  // 元件在 HTML 中的名稱
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss'],
  // 	Angular 14 以後的 Standalone Component 才有，用來直接引入需要的模組，不需註冊在 NgModule 裡
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatIconModule
  ]
})

export class ArticleFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  articleId?: string;
  isSubmitting = false;
  isGettingArticle = false;
  private snapshot: string | null = null; // 離開頁面防呆用

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private gs: GoogleSheetsService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      tags: [''],
      status: ['draft', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    this.articleId = id ?? undefined;
    this.isEdit = !!this.articleId;

    if (this.isEdit && this.articleId) {
      this.isGettingArticle = true;
      this.gs.getById(this.articleId)
        .pipe(finalize(() => (this.isGettingArticle = false)))
        .subscribe({
          next: (res: any) => {
            const a = res?.data ?? res; // GAS 端回 { ok, data } 或直接 data 都能吃
            this.form.patchValue({
              title: a.title ?? '',
              content: a.content ?? '',
              tags: Array.isArray(a.tags) ? a.tags.join(', ') : (a.tags || ''),
              status: a.status ?? 'draft'
            });
            this.snapshot = JSON.stringify(this.form.value);
          },
          error: (e) => {
            console.error('讀取失敗', e);
            alert('讀取文章失敗');
          }
        });
    }

  }

  onSubmit() {
    if (this.form.invalid) return;
    this.isSubmitting = true;
    const tagsValue = this.form.value.tags;
    const tagsArray = typeof tagsValue === 'string'
      ? tagsValue.split(',').map(tag => tag.trim()).filter(tag => tag)
      : [];

    const article: Article = {
      id: this.articleId || Date.now(),
      author: 'Admin',
      createdAt: new Date(),
      tags: tagsArray,
      sheetName: 'article',
      ...this.form.value,
      status: this.form.value.status || 'draft'
    };
    if (this.isEdit) {
      this.gs.update(article.id, article)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: (res) => {
          console.log('寫入成功', res);
          this.router.navigate(['/article']);
        },
        error: (e) => console.error('寫入失敗', e),
      });
    } else {
      this.gs.addArticleViaAppsScript(article)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: (res) => {
          console.log('寫入成功', res);
          this.router.navigate(['/article']);
        },
        error: (e) => console.error('寫入失敗', e),
      });
    }
  }

  onBack() {
    this.router.navigate(['/article']);
  }
}
