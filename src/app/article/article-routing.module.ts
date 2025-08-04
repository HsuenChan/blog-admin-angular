// article-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleListComponent } from './article-list.component';
import { ArticleFormComponent } from './article-form.component';

const routes: Routes = [
  {
    path: '',
    component: ArticleListComponent
  },
  {
    path: 'new',
    component: ArticleFormComponent
  },
  {
    path: 'edit/:id',
    component: ArticleFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // ✅ 子模組用 forChild
  exports: [RouterModule]
})
export class ArticleRoutingModule {}
