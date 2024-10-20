import { AsyncPipe, NgIf } from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem } from '@angular/material/list';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import {InviteUserComponent} from '@components/users/invite-user/invite-user.component';
import { User } from '@interfaces/user';
import { Button } from 'primeng/button';
import { UserService } from '@services/user.service';
import { ListSource } from '@interfaces/list-source';
import { ListComponent } from '@shared/list/list.component';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  imports: [
    MatList,
    MatListItem,
    ListComponent,
    MatButton,
    MatIcon,
    NgIf,
    Button,
    AsyncPipe,
    InviteUserComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {
  listUsers$: Observable<ListSource[]> = new Observable<ListSource[]>();
  channelId!: number;

  private userService = inject(UserService);
  private sanitizer = inject(DomSanitizer);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.listUsers$ = this.route.queryParams.pipe(
      map(params => +params['channelId']),
      switchMap(channelId => {
        this.channelId = channelId;
        return this.userService.getCurrentChannelUsers(channelId);
      }),
      map(users => this.parseUsers(users))
    );
  }

  private parseUsers(users: User[]): ListSource[] {
    return users.map(user => ({
      id: user.id,
      name: user.username,
      icon: this.sanitizer.bypassSecurityTrustHtml(
        user.is_online
          ? '<i class="pi pi-circle-fill" style="color: green"></i>'
          : '<i class="pi pi-circle-fill" style="color: red"></i>'
      ) as string,
    }));
  }

  onDialogClosed(): void {
    this.listUsers$ = this.userService.getCurrentChannelUsers(this.channelId).pipe(
      map(users => this.parseUsers(users))
    );
  }
}

