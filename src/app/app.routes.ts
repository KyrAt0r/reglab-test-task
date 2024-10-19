import { Routes } from '@angular/router';
import {UserComponent} from '@components/user/user.component';
import {authGuard} from './guards/auth.guard';
import {HomePageComponent} from '@components/home-page/home-page.component';
import {LoginPageComponent} from '@components/login-page/login-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent, canActivate: [authGuard]},
  { path: 'login', component: LoginPageComponent },
  { path: 'user', component: UserComponent },
  { path: '**', redirectTo: '/' }
];
