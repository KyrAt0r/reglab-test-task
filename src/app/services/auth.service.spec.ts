import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

class MockRouter {
  navigate(path: string[]) {}
}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: MockRouter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useClass: MockRouter }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as MockRouter;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('должен установить authenticated в true при успешном входе', () => {
    const mockUsers = [
      { username: 'validUser', password: 'validPassword' }
    ];

    service.login('validUser', 'validPassword').subscribe(success => {
      expect(success).toBeTrue();
      expect(sessionStorage.getItem('authenticatedUser')).toBe(JSON.stringify(mockUsers[0]));
    });

    const req = httpMock.expectOne('http://localhost:3000/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('должен вернуть false при неудачном входе', () => {
    const mockUsers = [
      { username: 'otherUser', password: 'otherPassword' }
    ];

    service.login('invalidUser', 'invalidPassword').subscribe(success => {
      expect(success).toBeFalse();
    });

    const req = httpMock.expectOne('http://localhost:3000/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('должен определить, что пользователь вошел в систему, если данные сохранены в sessionStorage', () => {
    sessionStorage.setItem('authenticatedUser', JSON.stringify({ username: 'validUser' }));
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('должен определить, что пользователь не вошел в систему, если данные не сохранены в sessionStorage', () => {
    sessionStorage.removeItem('authenticatedUser');
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('должен удалить данные из sessionStorage и перенаправить на страницу входа при выходе', () => {
    const routerSpy = spyOn(router, 'navigate');
    sessionStorage.setItem('authenticatedUser', JSON.stringify({ username: 'validUser' }));

    service.logout();
    expect(sessionStorage.getItem('authenticatedUser')).toBeNull();
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });
});
