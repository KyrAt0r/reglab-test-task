import {NgClass} from '@angular/common';
import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.css',
  standalone: true,
  imports: [
    NgClass
  ],
})
export class ChatHeaderComponent {
  @Input() chatTitle: string = 'Chat';
}
