import {NgClass, NgForOf} from '@angular/common';
import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatDivider} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatList, MatListItem} from '@angular/material/list';
import {ChannelListComponent} from '@components/channels/channel-list/channel-list.component';
import {ChatComponent} from '@components/main/chat/chat.component';
import {SideBarComponent} from '@components/main/side-bar/side-bar.component';
import {UserListComponent} from '@components/users/user-list/user-list.component';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  standalone: true,
  imports: [
    MatList,
    MatListItem,
    MatButton,
    NgClass,
    NgForOf,
    MatInput,
    FormsModule,
    MatIconButton,
    MatIcon,
    MatFormFieldModule,
    MatDivider,
    ChatComponent,
    ChannelListComponent,
    UserListComponent,
    SideBarComponent
  ],
})
export class HomePageComponent  {

}
