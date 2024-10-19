import {Component, inject, OnInit} from '@angular/core';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {User} from '@interfaces/user';
import {UserService} from '@services/user.service';
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
  user!: User;
  private authService = inject(AuthService);
  private userService = inject(UserService);

  ngOnInit(): void {
    this.user = this.userService.getUser();
  }

  logout(): void {
    this.authService.logout();
  }
}
