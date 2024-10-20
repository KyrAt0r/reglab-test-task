import {Routes} from '@angular/router';
import {authGuard} from './guards/auth.guard';
import {HomePageComponent} from '@components/home-page/home-page.component';
import {LoginPageComponent} from '@components/auth/login-page/login-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    canActivate: [authGuard],
    title: 'Чат'
  },
  {
    path: 'login',
    component: LoginPageComponent,
    title: 'Авторизация'
  },
  {
    path: 'user/:id',
    loadComponent: () => import('@components/users/user/user.component').then(m => m.UserComponent),
    canActivate: [authGuard],
    title: 'Профиль'
  },
  {
    path: '**',
    redirectTo: '/'
  }
];
