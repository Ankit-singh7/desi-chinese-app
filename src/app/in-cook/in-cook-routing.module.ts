import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InCookPage } from './in-cook.page';

const routes: Routes = [
  {
    path: '',
    component: InCookPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InCookPageRoutingModule {}
