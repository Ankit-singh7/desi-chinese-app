import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContainerPage } from './container.page';
import { AuthService } from '../services/auth/auth.service';

const routes: Routes = [
  {
    path: '',
    component: ContainerPage,
    children: [

    {
      path: 'dashboard',
      loadChildren: () => import('../dashboard/dashboard.module').then( m => m.DashboardPageModule),
      canActivate: [AuthService]
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    },
    {
      path: 'billing',
      loadChildren: () => import('../billing/billing.module').then( m => m.BillingPageModule),
      canActivate: [AuthService]
    },
    {
      path: 'billing-list',
      loadChildren: () => import('../billing-list/billing-list.module').then( m => m.BillingListPageModule),
      canActivate: [AuthService]
    },
    {
      path: 'billing-view',
      loadChildren: () => import('../billing-view/billing-view.module').then( m => m.BillingViewPageModule),
      canActivate: [AuthService]
    },
    {
      path: 'session',
      loadChildren: () => import('../session/session.module').then( m => m.SessionPageModule),
      canActivate: [AuthService]
    },
    {
      path: 'password-reset',
      loadChildren: () => import('../password-reset/password-reset.module').then( m => m.PasswordResetPageModule)
    },
    {
      path: 'setting',
      loadChildren: () => import('../setting/setting.module').then( m => m.SettingPageModule),
      canActivate: [AuthService]
    },
    {
      path: 'change-password',
      loadChildren: () => import('../change-password/change-password.module').then( m => m.ChangePasswordPageModule)
    },
    {
      path: 'closing-balance',
      loadChildren: () => import('../closing-balance/closing-balance.module').then( m => m.ClosingBalancePageModule)
    }
  ]

}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContainerPageRoutingModule {}
