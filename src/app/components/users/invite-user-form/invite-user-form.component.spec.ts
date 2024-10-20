import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {InviteUserFormComponent, type UserForInvite} from './invite-user-form.component';
import { UserService } from '@services/user.service';
import { ChannelService } from '@services/channel.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LinkUserChannel } from '@interfaces/link-user-channel';

describe('InviteUserFormComponent', () => {
  let component: InviteUserFormComponent;
  let userService: jasmine.SpyObj<UserService>;
  let channelService: jasmine.SpyObj<ChannelService>;
  let route: ActivatedRoute;
  let messageService: jasmine.SpyObj<MessageService>;
  let ref: jasmine.SpyObj<DynamicDialogRef>;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsersNotInChannel']);
    const channelServiceSpy = jasmine.createSpyObj('ChannelService', ['inviteUserToChannel']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    const dialogRefSpy = jasmine.createSpyObj('DynamicDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [InviteUserFormComponent],
      providers: [
        FormBuilder,
        { provide: UserService, useValue: userServiceSpy },
        { provide: ChannelService, useValue: channelServiceSpy },
        { provide: ActivatedRoute, useValue: { queryParams: of({ channelId: '1' }) } },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: DynamicDialogRef, useValue: dialogRefSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    channelService = TestBed.inject(ChannelService) as jasmine.SpyObj<ChannelService>;
    route = TestBed.inject(ActivatedRoute);
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    ref = TestBed.inject(DynamicDialogRef) as jasmine.SpyObj<DynamicDialogRef>;
    component = TestBed.createComponent(InviteUserFormComponent).componentInstance;
  });

  it('должен инициализировать форму и загрузить пользователей, не состоящих в канале', () => {
    const mockUsers: UserForInvite[] = [
      { id: 1, username: 'User1', is_online: true },
      { id: 2, username: 'User2', is_online: false }
    ];


    component.ngOnInit();

    expect(component.channelId).toBe(1);
    expect(userService.getUsersNotInChannel).toHaveBeenCalledWith(1);
    expect(component.users).toEqual(mockUsers);
  });

  it('должен отправить приглашения выбранным пользователям', () => {
    component.channelId = 1;
    component.userForm.setValue({ selectedUsers: [
        { id: 1, username: 'User1', is_online: true },
        { id: 2, username: 'User2', is_online: false }
      ] });

    const inviteRequests: LinkUserChannel[] = [
      { user_id: 1, channel_id: 1 },
      { user_id: 2, channel_id: 1 }
    ];

    component.inviteUser();

    expect(channelService.inviteUserToChannel).toHaveBeenCalledTimes(2);
    inviteRequests.forEach(invite => {
      expect(channelService.inviteUserToChannel).toHaveBeenCalledWith(invite);
    });
    expect(ref.close).toHaveBeenCalled();
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'Успех', detail: 'Пользователь приглашён' });
  });

  it('должен отписаться от всех подписок при уничтожении компонента', () => {
    spyOn(component['queryParamsSubscription'], 'unsubscribe');
    spyOn(component['usersSubscription'], 'unsubscribe');

    component.ngOnDestroy();

    expect(component['queryParamsSubscription'].unsubscribe).toHaveBeenCalled();
    expect(component['usersSubscription'].unsubscribe).toHaveBeenCalled();
  });
});
