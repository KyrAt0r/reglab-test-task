import {AsyncPipe, NgForOf} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {ActivatedRoute} from '@angular/router';
import {ChatHeaderComponent} from '@components/main/chat/chat-header/chat-header.component';
import {Message} from '@interfaces/message';
import {User} from '@interfaces/user';
import {ChannelService} from '@services/channel.service';
import {ChatService} from '@services/chat.service';
import {UserService} from '@services/user.service';
import {generateId} from '@shared/utils/generate-id';
import {ButtonModule} from 'primeng/button';
import {IconFieldModule} from 'primeng/iconfield';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputTextModule} from 'primeng/inputtext';
import {interval, Subscription, switchMap} from 'rxjs';

interface MessageForRender {
  id: number;
  from_user: string;
  content: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    ButtonModule,
    InputTextModule,
    NgForOf,
    ReactiveFormsModule,
    IconFieldModule,
    InputGroupModule,
    AsyncPipe,
    ChatHeaderComponent
  ],
})
export class ChatComponent implements OnInit, OnDestroy {
  messagesForRender: MessageForRender[] = [];
  messageForm: FormGroup;
  currentUser!: User;
  pollingSubscription: Subscription = new Subscription();
  channelId!: number;
  channelName!: string;
  usersFromChannel: User[] = [];
  loadMessagesData: boolean = false;

  private queryParamsSubscription!: Subscription;

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private channelService: ChannelService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.messageForm = this.createMessageForm();
  }

  ngOnInit(): void {
    this.loadMessagesData = false;
    this.currentUser = this.userService.getUser();
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      this.channelId = +params['channelId'];
      this.loadMessages();
      this.getChannelNames();
      this.loadUsersFromChannel();
      this.startLongPollingMessages();
    });
    console.log(this.channelName)
  }

  ngOnDestroy(): void {
    this.pollingSubscription.unsubscribe();
    this.queryParamsSubscription.unsubscribe();
  }

  private createMessageForm(): FormGroup {
    return this.fb.group({
      content: ['', Validators.required]
    });
  }

  private loadMessages(): void {
    this.chatService.getMessages().subscribe(messages => {
      this.updateMessagesForRender(messages);
    });
  }

  private startLongPollingMessages(): void {
    this.pollingSubscription.add(
      interval(2000) // Интервал в 2 секунды между запросами
        .pipe(switchMap(() => this.chatService.getMessages()))
        .subscribe(messages => {
          this.updateMessagesForRender(messages);
        })
    );
  }

  private updateMessagesForRender(messages: Message[]): void {
    if (!this.usersFromChannel.length) {
      return;
    }
    const chatMessages = messages.filter(message => message.channel_id === this.channelId);
    this.messagesForRender = chatMessages.map((message) => {
      const user = this.usersFromChannel.find(user => user.id === message.from_user);
      this.loadMessagesData = true;
      return {
        id: message.id,
        from_user: user ? user.username : 'Unknown',
        content: message.content
      };
    });
  }

  sendMessage(): void {
    if (this.messageForm.invalid) {
      return;
    }

    const newMessage: Message = {
      id: generateId(),
      from_user: this.currentUser.id,
      channel_id: this.channelId,
      content: this.messageForm.value.content
    };

    this.chatService.sendMessage(newMessage).subscribe((message) => {
      this.messagesForRender.push({
        id: message.id,
        from_user: this.currentUser.username,
        content: message.content
      });
      this.messageForm.reset();
    });
  }

  private getChannelNames(): void {
    this.channelService.getChannelsById(this.channelId).subscribe(channel => {
      this.channelName = channel[0].name;
    });
  }

  private loadUsersFromChannel(): void {
    this.userService.getCurrentChannelUsers(this.channelId).subscribe(users => {
      this.usersFromChannel = users;
    });
  }
}
