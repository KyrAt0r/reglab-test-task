import { Component } from '@angular/core';
import {DividerModule} from 'primeng/divider';
import {ChannelListComponent} from '@components/channel-list/channel-list.component';
import {PersonalUserPanelComponent} from '../personal-user-panel/personal-user-panel.component';
import {UserListComponent} from '../user-list/user-list.component';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    ChannelListComponent,
    UserListComponent,
    PersonalUserPanelComponent,
    DividerModule
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

}
