import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalUserPanelComponent } from './personal-user-panel.component';

describe('PersonalUserPanelComponent', () => {
  let component: PersonalUserPanelComponent;
  let fixture: ComponentFixture<PersonalUserPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalUserPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalUserPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
