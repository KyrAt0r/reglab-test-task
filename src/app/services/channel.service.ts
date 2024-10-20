import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Channel} from '@interfaces/channel';

import type {LinkUserChannel} from '@interfaces/link-user-channel';

import {map, Observable, switchMap} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  private readonly apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getChannelForCurrentUser(userId: number): Observable<Channel[]> {
    return this.http.get<{ user_id: number, channel_id: number }[]>(`${this.apiUrl}/user_channels`).pipe(
      map(userChannels => {
        return userChannels
          .filter(userChannel => userChannel.user_id === userId)
          .map(userChannel => userChannel.channel_id);
      }),
      switchMap(channelsIds => {
        return this.http.get<Channel[]>(`${this.apiUrl}/channels`).pipe(
          map(channel => channel.filter(channel => channelsIds.includes(channel.id)))
        );
      })
    );
  }

  getAllChannels(): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}/channels`);
  }

  getChannelsById(id: number): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}/channels/?id=${id}`);
  }

  addChannel(channel: Channel): Observable<any> {
    return this.http.post(`${this.apiUrl}/channels/`, channel);
  }

  inviteUserToChannel(invite: LinkUserChannel): Observable<LinkUserChannel> {
    return this.http.post<LinkUserChannel>(`${this.apiUrl}/user_channels`, invite);
  }
}
