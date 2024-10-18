import {AsyncPipe, NgForOf} from '@angular/common';
import {Component, type OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {ActivatedRoute} from '@angular/router';
import {Message} from '@interfaces/message';
import {User} from '@interfaces/user';
import {ChatService} from '@services/chat.service';
import {UserService} from '@services/user.service';
import {ButtonModule} from 'primeng/button';
import {IconFieldModule} from 'primeng/iconfield';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputTextModule} from 'primeng/inputtext';
import {Observable, Subscription} from 'rxjs';

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
    AsyncPipe
  ],
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  messagesForRender!: MessageForRender[];
  messageForm: FormGroup;
  currentUser!: User;
  pollingSubscription!: Subscription;
  channelId!: number;

  messagesForRender$!: Observable<MessageForRender[]>;

  private createMessageForm(): FormGroup {
    return this.fb.group({
      content: ['', Validators.required]
    });
  }

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.messageForm = this.createMessageForm();
  }

  ngOnInit(): void {
    this.currentUser = this.userService.getUser();
    this.route.queryParams.subscribe(params => {
      this.channelId = +params['channelId'];
    });
    this.startLongPollingMessages();
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  startLongPollingMessages(): void {
    this.pollMessages();
  }

  pollMessages(): void {
    this.pollingSubscription = this.chatService.getMessages().subscribe(messages => {
      const chatMessages = messages.filter(message => message.channel_id === this.channelId);
      this.userService.getUsers().subscribe(users => {
        this.messagesForRender = chatMessages.map((message) => {
          const user = users.find((u) => u.id === message.from_user);
          return {
            id: message.id,
            from_user: user ? user.username : 'Unknown',
            content: message.content
          };
        });

        this.pollMessages();
      });
    });
  }

  sendMessage(): void {
    if (this.messageForm.invalid) {
      return;
    }

    const newMessage: Message = {
      id: this.generateMessageId(),
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

  generateMessageId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
  }
}
