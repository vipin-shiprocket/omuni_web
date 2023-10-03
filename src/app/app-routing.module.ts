import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { RegisterComponent } from './pages/auth/register/register.component';
// import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('src/app/pages/auth/login/login.component').then(
        (c) => c.LoginComponent,
      ),
  },
  {
    path: 'forgotpassword',
    loadComponent: () =>
      import(
        'src/app/pages/auth/forgot-password/forgot-password.component'
      ).then((c) => c.ForgotPasswordComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('src/app/pages/auth/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: 'resetpassword',
    loadComponent: () =>
      import('src/app/pages/auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
  },
  {
    path: 'docs',
    loadComponent: () =>
      import('./components/docs/docs.component').then((c) => c.DocsComponent),
  },
  {
    path: '',
    loadChildren: () =>
      import('./pages/layout/layout.module').then((m) => m.LayoutModule),
  },

  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  }, // redirect to `login`
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
