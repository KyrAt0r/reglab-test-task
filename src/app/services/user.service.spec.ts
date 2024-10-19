import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '@interfaces/user';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('должен быть создан', () => {
    expect(service).toBeTruthy();
  });

  it('должен получать список пользователей', () => {
    const mockUsers: User[] = [
      { id: 1, username: 'user1', password: 'password1', is_online: true },
      { id: 2, username: 'user2', password: 'password2', is_online: false }
    ];

    service.getUsers().subscribe((users) => {
      expect(users.length).toBe(2);
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('http://localhost:3000/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('должен получать аутентифицированного пользователя из sessionStorage', () => {
    const mockUser = { id: 1, username: 'user1', password: 'password1', is_online: true };
    sessionStorage.setItem('authenticatedUser', JSON.stringify(mockUser));

    const user = service.getUser();
    expect(user).toEqual(mockUser);
  });

  it('должен обновлять данные пользователя', () => {
    const updatedUser = { id: 1, username: 'updatedUser', password: 'newPassword', is_online: true };

    service.updateUser(1, updatedUser).subscribe((response) => {
      expect(response).toEqual(updatedUser);
    });

    const req = httpMock.expectOne('http://localhost:3000/users/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedUser);
    req.flush(updatedUser);
  });
});
