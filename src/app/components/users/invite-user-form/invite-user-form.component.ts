import {JsonPipe} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {LinkUserChannel} from '@interfaces/link-user-channel';
import {ChannelService} from '@services/channel.service';
import {UserService} from '@services/user.service';
import {MessageService} from 'primeng/api';
import {ButtonDirective} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {InputTextModule} from 'primeng/inputtext';
import {MultiSelectModule} from 'primeng/multiselect';
import {Subscription} from 'rxjs';

export interface UserForInvite {
  id: number;
  username: string;
  is_online: boolean;
}

@Component({
  selector: 'app-invite-user-form',
  templateUrl: './invite-user-form.component.html',
  styleUrls: ['./invite-user-form.component.css'],
  standalone: true,
  imports: [
    ButtonDirective,
    InputTextModule,
    ReactiveFormsModule,
    DropdownModule,
    MultiSelectModule,
    JsonPipe
  ],
  providers: [MessageService]
})
export class InviteUserFormComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  users!: UserForInvite[];
  channelId!: number;

  private queryParamsSubscription!: Subscription;
  private usersSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private channelService: ChannelService,
    private userService: UserService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private ref: DynamicDialogRef,
  ) {
    this.userForm = this.fb.group({
      selectedUsers: [[], [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      this.channelId = +params['channelId'];
    });
    this.loadUsers();
  }

  ngOnDestroy(): void {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }

  loadUsers(): void {
    this.usersSubscription = this.userService.getUsersNotInChannel(this.channelId).subscribe(users => {
      this.users = users;
    });
  }

  inviteUser(): void {
    if (this.userForm.valid) {
      const selectedUsers: UserForInvite[] = this.userForm.get('selectedUsers')?.value;
      const inviteRequests: LinkUserChannel[] = selectedUsers.map((user: UserForInvite) => ({
        user_id: user.id,
        channel_id: this.channelId
      }));

      inviteRequests.forEach(invite => {
        this.channelService.inviteUserToChannel(invite).subscribe({
          next: () => {
            this.ref.close();
            this.messageService.add({severity: 'success', summary: 'Успех', detail: 'Пользователь приглашён'});
          },
          error: () => {
            this.ref.close();
            this.messageService.add({severity: 'error', summary: 'Что пошло не так...', detail: 'Ошибка'});
          }
        });
      });
    }
  }
}
