import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { UserListComponent } from './user-list.component';
import { UserService } from '@services/user.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ListSource } from '@interfaces/list-source';

describe('Компонент UserListComponent', () => {
  let component: UserListComponent;
  let userService: UserService;
  let fixture: any;
  let mockUsers = [
    {
      id: 1,
      username: 'testuser',
      password: 'password123',
      is_online: true
    },
    {
      id: 2,
      username: 'user2',
      password: 'user2',
      is_online: false
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UserListComponent],
      providers: [
        { provide: DomSanitizer, useValue: { bypassSecurityTrustHtml: (value: string) => value } },
        { provide: ActivatedRoute, useValue: {} }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
  });

  it('должен создать компонент', () => {
    expect(component).toBeTruthy();
  });

  it('должен вызвать getUsers в ngOnInit и установить listSource', () => {
    spyOn(userService, 'getUsers').and.returnValue(of(mockUsers));
    component.ngOnInit();
    expect(userService.getUsers).toHaveBeenCalled();
    expect(component.listSource.length).toBe(2);
    expect(component.listSource[0].name).toBe('testuser');
  });

  it('должен правильно парсить пользователей', () => {
    const parsedUsers: ListSource[] = component.parseUsers(mockUsers);
    expect(parsedUsers.length).toBe(2);
    expect(parsedUsers[0].id).toBe(1);
    expect(parsedUsers[0].name).toBe('testuser');
    expect(parsedUsers[1].name).toBe('user2');
  });

  it('должен отображать пользователей в шаблоне, когда listSource заполнен', () => {
    component.listSource = component.parseUsers(mockUsers);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-list')).toBeTruthy();
    expect(compiled.querySelector('.label').textContent).toContain('Пользователи');
  });

  it('должен отображать сообщение об отсутствии пользователей, когда listSource пуст', () => {
    component.listSource = [];
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('В чате нет пользователй');
  });
});
