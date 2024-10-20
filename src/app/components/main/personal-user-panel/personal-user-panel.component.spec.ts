import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalUserPanelComponent } from './personal-user-panel.component';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';
import { User } from '@interfaces/user';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';

describe('Компонент PersonalUserPanel', () => {
  let component: PersonalUserPanelComponent;
  let fixture: ComponentFixture<PersonalUserPanelComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout']);
    mockUserService = jasmine.createSpyObj('UserService', ['getUser']);

    const mockUser: User = {
      id: 1,
      username: 'testuser',
      password: 'password123',
      is_online: true
    };
    mockUserService.getUser.and.returnValue(mockUser);

    await TestBed.configureTestingModule({
      imports: [
        AvatarModule,
        ButtonModule,
        ButtonGroupModule,
        MatIconModule,
        PersonalUserPanelComponent
      ],

      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalUserPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('должен создаваться', () => {
    expect(component).toBeTruthy();
  });

  it('должен отображать информацию о пользователе', () => {
    const userInfoElement = fixture.debugElement.query(By.css('.user-info')).nativeElement;
    expect(userInfoElement.textContent).toContain('testuser');
  });

  it('должен вызывать метод выхода из AuthService при нажатии на кнопку выхода', () => {
    const logoutButton = fixture.debugElement.query(By.css('.user-panel-buttons p-button[icon="pi pi-sign-out"]'));
    logoutButton.triggerEventHandler('onClick', null);
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
