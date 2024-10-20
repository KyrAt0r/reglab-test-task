import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '@interfaces/user';
import { environment } from '../../environments/environment';

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

  it('должен получить пользователей текущего канала', () => {
    const channelId = 1;
    const mockUserChannels = [
      { user_id: 1, channel_id: 1 },
      { user_id: 2, channel_id: 1 },
      { user_id: 3, channel_id: 2 }
    ];
    const mockUsers: User[] = [
      { id: 1, username: 'User 1', password: 'pass1', is_online: true },
      { id: 2, username: 'User 2', password: 'pass2', is_online: false },
      { id: 3, username: 'User 3', password: 'pass3', is_online: true }
    ];

    service.getCurrentChannelUsers(channelId).subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual([mockUsers[0], mockUsers[1]]);
    });

    const req1 = httpMock.expectOne(`${environment.apiUrl}/user_channels`);
    expect(req1.request.method).toBe('GET');
    req1.flush(mockUserChannels);

    const req2 = httpMock.expectOne(`${environment.apiUrl}/users`);
    expect(req2.request.method).toBe('GET');
    req2.flush(mockUsers);
  });

  it('должен получить пользователей, которые не находятся в текущем канале', () => {
    const channelId = 1;
    const mockUserChannels = [
      { user_id: 1, channel_id: 1 },
      { user_id: 2, channel_id: 1 }
    ];
    const mockUsers: User[] = [
      { id: 1, username: 'User 1', password: 'pass1', is_online: true },
      { id: 2, username: 'User 2', password: 'pass2', is_online: false },
      { id: 3, username: 'User 3', password: 'pass3', is_online: true }
    ];

    service.getUsersNotInChannel(channelId).subscribe(users => {
      expect(users.length).toBe(1);
      expect(users).toEqual([mockUsers[2]]);
    });

    const req1 = httpMock.expectOne(`${environment.apiUrl}/user_channels`);
    expect(req1.request.method).toBe('GET');
    req1.flush(mockUserChannels);

    const req2 = httpMock.expectOne(`${environment.apiUrl}/users`);
    expect(req2.request.method).toBe('GET');
    req2.flush(mockUsers);
  });

  it('должен получить аутентифицированного пользователя из sessionStorage', () => {
    const mockUser: User = { id: 1, username: 'User 1', password: 'pass1', is_online: true };
    sessionStorage.setItem('authenticatedUser', JSON.stringify(mockUser));

    const user = service.getUser();
    expect(user).toEqual(mockUser);
  });

  it('должен обновить пользователя', () => {
    const userId = 1;
    const updatedUser = { id: 1, username: 'Updated User', password: 'newpass', is_online: false };

    service.updateUser(userId, updatedUser).subscribe(response => {
      expect(response).toEqual(updatedUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/?id=${userId}`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedUser);
  });
});
