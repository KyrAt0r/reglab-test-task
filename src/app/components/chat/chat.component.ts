import { Component } from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatFormField} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {ButtonDirective} from 'primeng/button';
import {IconFieldModule} from 'primeng/iconfield';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  standalone: true,
  imports: [
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    InputGroupModule,
    ButtonDirective
  ],
})
export class ChatComponent {

}
