import {Component, inject, type OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {User} from '@interfaces/user';
import {UserService} from '@services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  standalone: true,
  imports: [
    FormsModule
  ],
})
export class UserComponent implements OnInit {

  user!: User;

  private userService = inject(UserService)

  ngOnInit() {
    this.user = this.userService.getUser();
  }

  updateUser() {
    this.userService.updateUser(this.user.id, this.user)
  }
}
