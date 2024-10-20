import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPageComponent } from './login-page.component';
import { AuthService } from '@services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockAuthService {
  isLoggedIn() {
    return false;
  }

  login(username: string, password: string) {
    if (username === 'validUser' && password === 'validPassword') {
      return of(true);
    } else if (username === 'errorUser') {
      return throwError(() => new Error('Error occurred'));
    } else {
      return of(false);
    }
  }
}

class MockRouter {
  navigate(path: string[]) {}
}

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authService: MockAuthService;
  let router: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginPageComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as MockAuthService;
    router = TestBed.inject(Router) as MockRouter;
    fixture.detectChanges();
  });

  it('должен создать форму входа при инициализации', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.contains('username')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('должен отметить элементы управления формы как тронутые при отправке с некорректными данными', () => {
    component.onSubmit();
    expect(component.username?.touched).toBeTrue();
    expect(component.password?.touched).toBeTrue();
  });

  it('должен вызвать AuthService.login с правильными учетными данными, когда форма валидна', () => {
    const authServiceSpy = spyOn(authService, 'login').and.callThrough();
    component.loginForm.setValue({ username: 'validUser', password: 'validPassword' });
    component.onSubmit();
    expect(authServiceSpy).toHaveBeenCalledWith('validUser', 'validPassword');
  });

  it('должен перейти на главную страницу при успешном входе', () => {
    const routerSpy = spyOn(router, 'navigate');
    component.loginForm.setValue({ username: 'validUser', password: 'validPassword' });
    component.onSubmit();
    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });

  it('должен установить сообщение об ошибке при неудачном входе', () => {
    component.loginForm.setValue({ username: 'invalidUser', password: 'invalidPassword' });
    component.onSubmit();
    expect(component.errorMessage).toBe('Неверные данные');
  });

  it('должен установить сообщение об ошибке при возникновении ошибки во время входа', () => {
    component.loginForm.setValue({ username: 'errorUser', password: 'anyPassword' });
    component.onSubmit();
    expect(component.errorMessage).toBe('Ошибка при попытке входа. Попробуйте позже.');
  });
});
