import { Component, OnInit } from '@angular/core';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import {AuthService} from '@services/auth.service';


@Component({
  selector: 'app-personal-user-panel',
  templateUrl: './personal-user-panel.component.html',
  styleUrls: ['./personal-user-panel.component.css'],
  standalone: true,
  imports: [
    MatFabButton,
    MatIconModule,
    MatIconButton,
    AvatarModule,
    ButtonGroupModule,
    ButtonModule
  ],
})
export class PersonalUserPanelComponent implements OnInit {
  userName: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const authenticatedUser = sessionStorage.getItem('authenticatedUser');
    this.userName = authenticatedUser ? JSON.parse(authenticatedUser).login : 'Guest';
  }

  // Метод для выхода из системы
  logout(): void {
    this.authService.logout();
  }
}
