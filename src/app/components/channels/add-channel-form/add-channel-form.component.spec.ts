import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChannelFormComponent } from './add-channel-form.component';

describe('AddChannelFormComponent', () => {
  let component: AddChannelFormComponent;
  let fixture: ComponentFixture<AddChannelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddChannelFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddChannelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
