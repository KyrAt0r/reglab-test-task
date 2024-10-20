import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AddChannelFormComponent} from '@components/channels/add-channel-form/add-channel-form.component';
import {Button, ButtonDirective} from 'primeng/button';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['./add-channel.component.css'],
  standalone: true,
  imports: [
    Button,
    ButtonDirective,
  ],
  providers: [DialogService]
})
export class AddChannelComponent {
  @Output() dialogClosed = new EventEmitter<any>();

  channelForm: FormGroup;
  ref: DynamicDialogRef | undefined;

  constructor(private fb: FormBuilder, private dialogService: DialogService) {
    this.channelForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  openDialog(): void {
    this.ref = this.dialogService.open(AddChannelFormComponent, {
      header: 'Создать новый канал',
      width: '400px',
      closable: true
    });

    this.ref.onClose.subscribe(result => {
      if (result) {
        this.dialogClosed.emit(result);
      }
    });
  }
}
