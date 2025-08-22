import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ArticleService } from './article.service';
import { Article } from './article.model';
import { finalize } from 'rxjs/operators';

import { Router } from '@angular/router';
import { GoogleSheetsService } from './google-sheets.service';

// material
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-article-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    DatePipe,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})

export class ArticleListComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<Article>();
  displayedColumns: string[] = ['title', 'author', 'createdAt', 'actions'];
  isTableLoading = false
  deletingId: string | number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private articleService: ArticleService, private gs: GoogleSheetsService, private router: Router) {}

  ngOnInit(): void {
    this.isTableLoading = true;
    this.gs.getSheetData('article')
      .pipe(finalize(() => this.isTableLoading = false))
      .subscribe((res: any) => this.dataSource.data = res)
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  onDelete(row: any) {
    if (!confirm(`確定要刪除「${row.title}」嗎？`)) return
    if (this.deletingId) return

    this.deletingId = row.id
    this.gs.deleteArticleViaAppsScript({ id: row.id, sheetName: 'article' })
      .pipe(finalize(() => this.deletingId = null))
      .subscribe({
        next: (res) => {
          if (res?.ok) {
            this.dataSource.data = this.dataSource.data.filter((r: any) => r.id !== row.id);
            // TODO: snackbar 提示成功
          } else {
            console.error('刪除失敗：', res);
            // TODO: snackbar 提示失敗
          }
        },
        error: (e) => {
          console.error('刪除失敗：', e);
          // TODO: snackbar 提示失敗
        }
      });
  }

  onEdit(id: number) {
    this.router.navigate(['/article/edit', id]);
  }

  onCreate() {
    this.router.navigate(['/article/new']);
  }
}
