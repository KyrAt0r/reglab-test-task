import {NgIf} from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@services/user.service';
import {ButtonDirective} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import { Location } from '@angular/common';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    NgIf,
    ButtonDirective
  ],
})
export class UserComponent implements OnInit {
  userForm!: FormGroup;

  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private location = inject(Location);

  ngOnInit() {
    const user = this.userService.getUser();

    this.userForm = this.fb.group({
      username: [user.username, Validators.required],
      password: [user.password, Validators.required],
    });
  }

  updateUser() {
    if (this.userForm.valid) {
      const updatedUser = { ...this.userForm.value, id: this.userService.getUser().id };
      this.userService.updateUser(updatedUser.id, updatedUser);
    }
  }

  goBack() {
    this.location.back();
  }
}
