import {Component, EventEmitter, type OnDestroy, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {InviteUserFormComponent} from '@components/users/invite-user-form/invite-user-form.component';
import {ButtonDirective} from 'primeng/button';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.css'],
  standalone: true,
  imports: [
    ButtonDirective
  ],
  providers: [DialogService]
})
export class InviteUserComponent implements OnDestroy {
  @Output() dialogClosed = new EventEmitter<void>();

  channelForm: FormGroup;
  ref: DynamicDialogRef | undefined;
  private subscriptions: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private dialogService: DialogService) {
    this.channelForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  openDialog(): void {
    this.ref = this.dialogService.open(InviteUserFormComponent, {
      header: 'Пригласить пользователя',
      width: '400px',
      height: '600px',
      closable: true,
    });

    const dialogCloseSubscription = this.ref.onClose.subscribe(() => {
      this.dialogClosed.emit();
    });
    this.subscriptions.add(dialogCloseSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
