import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InDispatchPage } from './in-dispatch.page';

const routes: Routes = [
  {
    path: '',
    component: InDispatchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InDispatchPageRoutingModule {}
