import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InQueuePage } from './in-queue.page';

const routes: Routes = [
  {
    path: '',
    component: InQueuePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InQueuePageRoutingModule {}
