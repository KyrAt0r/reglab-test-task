import {NgIf} from '@angular/common';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatList, MatListItem} from '@angular/material/list';
import {DomSanitizer} from '@angular/platform-browser';
import {Button} from 'primeng/button';
import {UserService} from '@services/user.service';
import {ListSource} from '@interfaces/list-source';
import {ListComponent} from '@shared/list/list.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
  standalone: true,
  imports: [
    MatList,
    MatListItem,
    ListComponent,
    MatButton,
    MatIcon,
    NgIf,
    Button
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {
  users: any[] = []
  listSource: ListSource[] = [];

  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer)

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data: any) => {
      this.listSource = this.parseUsers(data);
      this.cdr.markForCheck();
    });
  }

  parseUsers(users: any[]): ListSource[] {
    return users.map(user => ({
      id: user.id,
      name: user.login,
      icon: this.sanitizer.bypassSecurityTrustHtml(
        user.is_online
          ? '<i class="pi pi-circle-fill" style="color: green"></i>'
          : '<i class="pi pi-circle-fill" style="color: red"></i>'
      ) as string,
    }));
  }

}
