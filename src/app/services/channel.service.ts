import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Channel} from '@interfaces/channel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  private apiUrl = 'http://localhost:3000/channels'; // URL json-server

  constructor(private http: HttpClient) { }

  getChannels(): Observable<Channel[]> {
    return this.http.get<Channel[]>(this.apiUrl);
  }
}
