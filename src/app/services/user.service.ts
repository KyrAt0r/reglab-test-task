import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {User} from '@interfaces/user';
import {map, Observable, switchMap} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getCurrentChannelUsers(channelId: number): Observable<User[]> {
    return this.http.get<{ user_id: number, channel_id: number }[]>(`${this.apiUrl}/user_channels`).pipe(
      map(userChannels => {
        return userChannels
          .filter(userChannel => userChannel.channel_id === channelId)
          .map(userChannel => userChannel.user_id);
      }),
      switchMap(userIds => {
        return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
          map(users => users.filter(user => userIds.includes(user.id)))
        );
      })
    );
  }

  getUsersNotInChannel(channelId: number): Observable<User[]> {
    return this.http.get<{ user_id: number, channel_id: number }[]>(`${this.apiUrl}/user_channels`).pipe(
      map(userChannels => {
        return userChannels
          .filter(userChannel => userChannel.channel_id === channelId)
          .map(userChannel => userChannel.user_id);
      }),
      switchMap(userIdsInChannel => {
        return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
          map(users => users.filter(user => !userIdsInChannel.includes(user.id)))
        );
      })
    );
  }


  getUser(): User {
    const authenticatedUser = sessionStorage.getItem('authenticatedUser');
    return authenticatedUser ? JSON.parse(authenticatedUser) : [];
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/?id=${id}`, user);
  }
}
