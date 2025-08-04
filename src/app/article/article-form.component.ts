import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from './article.service';
import { Article } from './article.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatRadioModule
  ]
})
export class ArticleFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  articleId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      tags: [''],
      status: ['draft', Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const article = this.articleService.getById(+id);
        if (article) {
          this.isEdit = true;
          this.articleId = article.id;
          this.form.patchValue(article);
        }
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const tagsValue = this.form.value.tags;
    const tagsArray = typeof tagsValue === 'string'
      ? tagsValue.split(',').map(tag => tag.trim()).filter(tag => tag)
      : [];

    const article: Article = {
      id: this.articleId || Date.now(),
      author: 'Admin',
      createdAt: new Date(),
      tags: tagsArray,
      ...this.form.value
    };

    if (this.isEdit) {
      this.articleService.update(article);
    } else {
      this.articleService.create(article);
    }

    this.router.navigate(['/article']);
  }
}
