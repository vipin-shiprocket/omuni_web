import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { RegisterComponent } from './pages/auth/register/register.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    loadChildren: () =>
      import('src/app/pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'forgotPassword',
    component: ForgotPasswordComponent,
    loadChildren: () =>
      import('src/app/pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'signUp',
    component: RegisterComponent,
    loadChildren: () =>
      import('src/app/pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'apps',
    loadComponent: () =>
      import('./pages/app-launcher/app-launcher.component').then(
        (c) => c.AppLauncherComponent,
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
