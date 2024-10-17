import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {MatButton, MatFabAnchor} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatList, MatListItem} from '@angular/material/list';
import {DomSanitizer} from '@angular/platform-browser';
import {RouterLink} from '@angular/router';
import {Button} from 'primeng/button';
import {DividerModule} from 'primeng/divider';
import {ChannelService} from '@services/channel.service';
import {ListSource} from '@interfaces/list-source';
import {ListComponent} from '@shared/list/list.component';

@Component({
  selector: 'app-channel-list',
  templateUrl: './channel-list.component.html',
  styleUrl: './channel-list.component.css',
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
    DividerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChannelListComponent implements OnInit {
  channels: any[] = [];
  listChannels: ListSource[] = [];

  private channelService = inject(ChannelService);
  private cdr = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer)

  ngOnInit(): void {
    this.channelService.getChannels().subscribe((data: any) => {
      this.listChannels = this.parseChannels(data);
      console.log(this.listChannels);
      this.cdr.markForCheck();
    });
  }

  parseChannels(channels: any[]): ListSource[] {
    return channels.map(channel => ({
      id: channel.id,
      name: channel.name,
      icon: this.sanitizer.bypassSecurityTrustHtml(
        '<i class="pi pi-hashtag"></i>'
      ) as string,
    }));
  }
}
