import {ScrollingModule} from '@angular/cdk/scrolling';
import {NgClass, NgForOf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatList, MatListItem} from '@angular/material/list';
import {RouterLink} from '@angular/router';
import {ListSource} from '@interfaces/list-source';
import {ScrollPanelModule} from 'primeng/scrollpanel';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    MatList,
    MatListItem,
    NgForOf,
    ScrollingModule,
    ScrollPanelModule,
    NgClass,
    RouterLink
  ],
})
export class ListComponent {
  @Input() items: ListSource[] = [];
  @Input() interact?: boolean = false;
}
