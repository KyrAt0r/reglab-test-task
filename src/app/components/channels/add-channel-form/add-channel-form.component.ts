import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Channel} from '@interfaces/channel';
import {ChannelService} from '@services/channel.service';
import {generateId} from '@shared/utils/generate-id';
import {ButtonDirective} from 'primeng/button';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {InputTextModule} from 'primeng/inputtext';
import {User} from '@interfaces/user';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-add-channel-form',
  standalone: true,
  imports: [
    ButtonDirective,
    InputTextModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-channel-form.component.html',
  styleUrls: ['./add-channel-form.component.css']
})
export class AddChannelFormComponent implements OnDestroy {
  channelForm: FormGroup;
  users: User[] = [];
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private channelService: ChannelService,
    private ref: DynamicDialogRef,
  ) {
    this.channelForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  addChannel(): void {
    if (this.channelForm.valid) {
      const newChannel: Channel = {
        id: generateId(),
        name: this.channelForm.get('name')?.value
      };
      const addChannelSubscription = this.channelService.addChannel(newChannel).subscribe({
        next: result => {
          this.ref.close(result);
        },
        error: error => {
          console.error('Error adding channel:', error);
        }
      });
      this.subscriptions.add(addChannelSubscription);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
