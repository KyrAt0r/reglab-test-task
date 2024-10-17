import {NgClass, NgIf} from '@angular/common';
import {Component, type OnInit} from '@angular/core';
import {FormBuilder, type FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatCard} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {Router} from '@angular/router';
import {AuthService} from '@services/auth.service';
import {Button} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {FloatLabelModule} from 'primeng/floatlabel';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  standalone: true,
  imports: [MatCard, ReactiveFormsModule, MatFormFieldModule, MatInput, MatButton, NgIf, MatIcon, Button, FloatLabelModule, PasswordModule, InputTextModule, CardModule, NgClass],
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe({
        next: (success) => {
          if (success) {
            this.router.navigate(['/']);
          } else {
            this.errorMessage = 'Неверные данные';
          }
        },
        error: () => {
          this.errorMessage = 'Ошибка при попытке входа. ' +
            'Попробуйте позже.';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }



  ngOnInit(): void {

  }
}
