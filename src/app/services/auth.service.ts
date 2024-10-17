import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '@interfaces/user';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticated = false;
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = sessionStorage.getItem('authenticatedUser');
    if (storedUser) {
      this.authenticated = true;
    }
  }

  login(login: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        const user = users.find(u => u.login === login && u.password === password);
        if (user) {
          sessionStorage.setItem('authenticatedUser', JSON.stringify(user));
          return true;
        }
        return false;
      })
    );
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('authenticatedUser');
  }

  logout() {
    this.router.navigate(['/login']);
    sessionStorage.removeItem('authenticatedUser');  // Удаляем информацию о пользователе
  }
}
