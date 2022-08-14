import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'queue',
        loadChildren: () => import('../in-queue/in-queue.module').then( m => m.InQueuePageModule)
      },
      {
        path: 'cook',
        loadChildren: () => import('../in-cook/in-cook.module').then( m => m.InCookPageModule)
      },
      {
        path: 'dispatch',
        loadChildren: () => import('../in-dispatch/in-dispatch.module').then( m => m.InDispatchPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
