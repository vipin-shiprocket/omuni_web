import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { authGuard } from './core/auth.guard';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/layout/layout.module').then((m) => m.LayoutModule),
  },
  {
    path: 'login',
    component: LoginComponent,
    // canMatch:()=>{},
    loadChildren: () =>
      import('src/app/pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'forgotpassword',
    component: ForgotPasswordComponent,
    loadChildren: () =>
      import('src/app/pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'register',
    component: RegisterComponent,
    loadChildren: () =>
      import('src/app/pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'signup',
    component: RegisterComponent,
    loadChildren: () =>
      import('src/app/pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'resetpassword',
    component: ResetPasswordComponent,
    loadChildren: () =>
      import('src/app/pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'apps',
    loadComponent: () =>
      import('./pages/app-launcher/app-launcher.component').then(
        (c) => c.AppLauncherComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'docs',
    loadComponent: () =>
      import('./components/docs/docs.component').then((c) => c.DocsComponent),
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
