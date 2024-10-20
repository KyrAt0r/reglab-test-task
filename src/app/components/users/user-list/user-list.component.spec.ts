import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserListComponent } from './user-list.component';
import { UserService } from '@services/user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '@interfaces/user';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let userService: jasmine.SpyObj<UserService>;
  let route: ActivatedRoute;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getCurrentChannelUsers']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UserListComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ channelId: '1' })
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    route = TestBed.inject(ActivatedRoute);
    component = TestBed.createComponent(UserListComponent).componentInstance;
  });

  it('должен получить пользователей текущего канала при инициализации', () => {
    const mockUsers: User[] = [
      { id: 1, username: 'User1', password: 'pass', is_online: true },
      { id: 2, username: 'User2', password: 'pass', is_online: false }
    ];

    userService.getCurrentChannelUsers.and.returnValue(of(mockUsers));

    component.ngOnInit();

    component.listUsers$.subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(jasmine.arrayContaining([{
        id: mockUsers[0].id,
        name: mockUsers[0].username,
        icon: jasmine.any(String)
      }, {
        id: mockUsers[1].id,
        name: mockUsers[1].username,
        icon: jasmine.any(String)
      }]));
    });
  });

  it('должен обновить список пользователей при закрытии диалога', () => {
    const mockUsers: User[] = [
      { id: 1, username: 'User1', password: 'pass', is_online: true },
      { id: 2, username: 'User2', password: 'pass', is_online: false }
    ];

    userService.getCurrentChannelUsers.and.returnValue(of(mockUsers));

    component.onDialogClosed();

    component.listUsers$.subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(jasmine.arrayContaining([{
        id: mockUsers[0].id,
        name: mockUsers[0].username,
        icon: jasmine.any(String)
      }, {
        id: mockUsers[1].id,
        name: mockUsers[1].username,
        icon: jasmine.any(String)
      }]));
    });
  });
});
