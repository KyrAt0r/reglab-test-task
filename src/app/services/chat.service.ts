import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Message} from '@interfaces/message';

import type {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly apiUrl = `${environment.apiUrl}/messages`;

  constructor(private http: HttpClient) {}

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.apiUrl);
  }

  sendMessage(message: Partial<Message>): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, message);
  }
}
