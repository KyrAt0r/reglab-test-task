import {ComponentFixture, TestBed} from '@angular/core/testing';
import { ChannelListComponent } from './channel-list.component';
import { ChannelService } from '@services/channel.service';
import { of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListSource } from '@interfaces/list-source';

const mockChannels: ListSource[] = [
  { id: 1, name: 'General', icon: ''},
  { id: 2, name: 'Random',  icon: '' }
];

describe('ChannelListComponent', () => {
  let component: ChannelListComponent;
  let fixture: ComponentFixture<ChannelListComponent>;
  let mockChannelService: jasmine.SpyObj<ChannelService>;
  let mockCdr: jasmine.SpyObj<ChangeDetectorRef>;
  let mockSanitizer: jasmine.SpyObj<DomSanitizer>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    mockChannelService = jasmine.createSpyObj('ChannelService', ['getChannels']);
    mockCdr = jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck']);
    mockSanitizer = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustHtml']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], { snapshot: { params: {} } });

    await TestBed.configureTestingModule({
      imports: [ChannelListComponent],
      providers: [
        { provide: ChannelService, useValue: mockChannelService },
        { provide: ChangeDetectorRef, useValue: mockCdr },
        { provide: DomSanitizer, useValue: mockSanitizer },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelListComponent);
    component = fixture.componentInstance;
    mockChannelService.getChannels.and.returnValue(of(mockChannels));
    mockSanitizer.bypassSecurityTrustHtml.and.callFake((html: string) => html);
    fixture.detectChanges();
  });

  it('должен создать компонент', () => {
    expect(component).toBeTruthy();
  });

  it('должен вызвать getChannels у ChannelService во время ngOnInit', () => {
    expect(mockChannelService.getChannels).toHaveBeenCalled();
  });

  it('должен корректно парсить каналы', () => {
    expect(component.listChannels.length).toBe(2);
    expect(component.listChannels[0].name).toBe('General');
    expect(component.listChannels[1].name).toBe('Random');
  });

  it('должен санировать HTML иконки', () => {
    expect(mockSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith('<i class="pi pi-hashtag"></i>');
  });

  it('должен передавать правильные каналы в app-list', () => {
    component.listChannels = mockChannels;
    fixture.detectChanges();
    const appList = fixture.debugElement.query(By.css('app-list')).componentInstance;
    expect(appList.items.length).toBe(2);  // Проверяем, что переданы два элемента
    expect(appList.items[0].name).toBe('General');
    expect(appList.items[1].name).toBe('Random');
  });


});
