import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {MatButton, MatFabAnchor} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatList, MatListItem} from '@angular/material/list';
import {DomSanitizer} from '@angular/platform-browser';
import {RouterLink} from '@angular/router';
import {AddChannelComponent} from '@components/channels/add-channel/add-channel.component';
import {InviteUserComponent} from '@components/users/invite-user/invite-user.component';
import {LinkUserChannel} from '@interfaces/link-user-channel';
import {User} from '@interfaces/user';
import {UserService} from '@services/user.service';
import {Button} from 'primeng/button';
import {DividerModule} from 'primeng/divider';
import {ChannelService} from '@services/channel.service';
import {ListSource} from '@interfaces/list-source';
import {ListComponent} from '@shared/list/list.component';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-channel-list',
  templateUrl: './channel-list.component.html',
  styleUrls: ['./channel-list.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    CommonModule,
    MatButton,
    MatFabAnchor,
    RouterLink,
    MatIcon,
    MatList,
    MatListItem,
    ListComponent,
    Button,
    DividerModule,
    AddChannelComponent,
    InviteUserComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChannelListComponent implements OnInit {
  listChannels$: Observable<ListSource[]> = new Observable<ListSource[]>();
  channelId!: number;
  currentUser!: User;
  private subscriptions: Subscription = new Subscription();

  private channelService = inject(ChannelService);
  private sanitizer = inject(DomSanitizer);
  private userService = inject(UserService);

  ngOnInit(): void {
    this.currentUser = this.userService.getUser();
    this.loadData();
  }

  private parseChannels(channels: any[]): ListSource[] {
    return channels.map(channel => ({
      id: channel.id,
      name: channel.name,
      icon: this.sanitizer.bypassSecurityTrustHtml('<i class="pi pi-hashtag"></i>') as string,
    }));
  }

  loadData(): void {
    this.listChannels$ = this.channelService.getChannelForCurrentUser(this.currentUser.id).pipe(
      map(channels => this.parseChannels(channels))
    );
  }

  onDialogClosed($event: any): void {
    const inviteRequests: LinkUserChannel = {
      user_id: this.currentUser.id,
      channel_id: $event.id
    };

    const inviteSubscription = this.channelService.inviteUserToChannel(inviteRequests).subscribe(() => this.loadData());
    this.subscriptions.add(inviteSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
