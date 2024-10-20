import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChannelListComponent } from './channel-list.component';
import { ChannelService } from '@services/channel.service';
import { UserService } from '@services/user.service';
import { LinkUserChannel } from '@interfaces/link-user-channel';
import { Channel } from '@interfaces/channel';
import { User } from '@interfaces/user';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ChannelListComponent', () => {
  let component: ChannelListComponent;
  let channelService: jasmine.SpyObj<ChannelService>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const channelServiceSpy = jasmine.createSpyObj('ChannelService', ['getChannelForCurrentUser', 'inviteUserToChannel']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUser']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ChannelListComponent],
      providers: [
        { provide: ChannelService, useValue: channelServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    channelService = TestBed.inject(ChannelService) as jasmine.SpyObj<ChannelService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    component = TestBed.createComponent(ChannelListComponent).componentInstance;
  });

  it('должен инициализировать текущего пользователя и загрузить каналы', () => {
    const mockUser: User = { id: 1, username: 'User1', password: 'pass', is_online: true };
    const mockChannels: Channel[] = [
      { id: 1, name: 'Channel 1' },
      { id: 2, name: 'Channel 2' }
    ];

    userService.getUser.and.returnValue(mockUser);
    channelService.getChannelForCurrentUser.and.returnValue(of(mockChannels));

    component.ngOnInit();

    expect(component.currentUser).toEqual(mockUser);
    component.listChannels$.subscribe(channels => {
      expect(channels.length).toBe(2);
      expect(channels).toEqual(jasmine.arrayContaining([{
        id: mockChannels[0].id,
        name: mockChannels[0].name,
        icon: jasmine.any(String)
      }, {
        id: mockChannels[1].id,
        name: mockChannels[1].name,
        icon: jasmine.any(String)
      }]));
    });
  });

  it('должен пригласить пользователя в канал и перезагрузить данные', () => {
    const mockUser: User = { id: 1, username: 'User1', password: 'pass', is_online: true };
    const inviteRequest: LinkUserChannel = { user_id: 1, channel_id: 2 };
    const mockEvent = { id: 2 };

    userService.getUser.and.returnValue(mockUser);
    channelService.inviteUserToChannel.and.returnValue(of(inviteRequest));
    spyOn(component, 'loadData');

    component.onDialogClosed(mockEvent);

    expect(channelService.inviteUserToChannel).toHaveBeenCalledWith(inviteRequest);
    expect(component.loadData).toHaveBeenCalled();
  });

  it('должен отписываться от всех подписок при уничтожении компонента', () => {
    spyOn(component['subscriptions'], 'unsubscribe');

    component.ngOnDestroy();

    expect(component['subscriptions'].unsubscribe).toHaveBeenCalled();
  });
});
