import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '@interfaces/user';
import {map, Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient, private router: Router) {
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
          this.storeAuthenticatedUser(user);
          return true;
        }
        return false;
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.getStoredUser();
  }

  logout(): void {
    const user = this.getStoredUser();
    if (user) {

      this.clearAuthenticatedUser();
      this.router.navigate(['/login']);

    } else {
      this.router.navigate(['/login']);
    }
  }

  // private setUserOnlineStatus(userId: number, isOnline: boolean): Observable<void> {
  //   const storedUser = this.getStoredUser();
  //
  //   if (storedUser) {
  //     storedUser.is_online = isOnline;
  //
  //     return this.http.put<void>(`${this.apiUrl}/?id=${userId}`, storedUser);
  //   }
  //
  //   return of(undefined);
  // }

  private storeAuthenticatedUser(user: User): void {
    sessionStorage.setItem('authenticatedUser', JSON.stringify(user));
  }

  private getStoredUser(): User | null {
    const storedUser = sessionStorage.getItem('authenticatedUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  private clearAuthenticatedUser(): void {
    sessionStorage.removeItem('authenticatedUser');
  }
}
