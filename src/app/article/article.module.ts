import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ArticleListComponent } from './article-list.component';
import { ArticleRoutingModule } from './article-routing.module';

@NgModule({
  // declarations: [ArticleListComponent],
  imports: [CommonModule, FormsModule, ArticleRoutingModule, ArticleListComponent]
})
export class ArticleModule {}
