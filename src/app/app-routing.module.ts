import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then(
        (c) => c.LoginComponent,
      ),
  },
  {
    path: 'forgotPassword',
    loadComponent: () =>
      import('./pages/auth/forgot-password/forgot-password.component').then(
        (c) => c.ForgotPasswordComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
