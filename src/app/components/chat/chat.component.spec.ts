import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { ChatService } from '@services/chat.service';
import { UserService } from '@services/user.service';
import { ChannelService } from '@services/channel.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let mockChatService: jasmine.SpyObj<ChatService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockChannelService: jasmine.SpyObj<ChannelService>;

  beforeEach(async () => {
    mockChatService = jasmine.createSpyObj('ChatService', ['getMessages', 'sendMessage']);
    mockUserService = jasmine.createSpyObj('UserService', ['getUser', 'getUsers']);
    mockChannelService = jasmine.createSpyObj('ChannelService', ['getChannelsById']);

    await TestBed.configureTestingModule({
      imports: [
        ChatComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: ChatService, useValue: mockChatService },
        { provide: UserService, useValue: mockUserService },
        { provide: ChannelService, useValue: mockChannelService },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ channelId: '1' })
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    mockUserService.getUser.and.returnValue({is_online: false, password: 'test', id: 1, username: 'test' });
    mockChatService.getMessages.and.returnValue(of([]));
    mockUserService.getUsers.and.returnValue(of([]));
    mockChannelService.getChannelsById.and.returnValue(of({ id: 1, name: 'Test Channel' }));
    fixture.detectChanges();
  });

  it('должен создать компонент', () => {
    expect(component).toBeTruthy();
  });

  it('должен инициализировать currentUser и channelId при инициализации', () => {
    expect(component.currentUser).toEqual({is_online: false, password: 'test', id: 1, username: 'test' });
    expect(component.channelId).toBe(1);
  });

  it('должен получить имя канала при инициализации', () => {
    expect(mockChannelService.getChannelsById).toHaveBeenCalledWith(1);
    expect(component.channelName).toBe('Test Channel');
  });

  it('должен вызвать sendMessage при валидной форме', () => {
    mockChatService.sendMessage.and.returnValue(of({ id: 2, from_user: 1, channel_id: 1, content: 'Hello' }));
    component.messageForm.setValue({ content: 'Hello' });
    component.sendMessage();
    expect(mockChatService.sendMessage).toHaveBeenCalled();
    expect(component.messagesForRender.length).toBe(1);
  });

  it('не должен вызывать sendMessage при невалидной форме', () => {
    component.messageForm.setValue({ content: '' });
    component.sendMessage();
    expect(mockChatService.sendMessage).not.toHaveBeenCalled();
  });

  it('должен отписаться от polling при уничтожении компонента', () => {
    const spy = spyOn(component.pollingSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
