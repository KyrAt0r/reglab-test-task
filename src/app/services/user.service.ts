import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {User} from '@interfaces/user';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUser(){
    const authenticatedUser = sessionStorage.getItem('authenticatedUser');
    return  authenticatedUser ? JSON.parse(authenticatedUser) : [];
  }
}
