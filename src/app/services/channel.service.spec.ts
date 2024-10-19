import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChannelService } from './channel.service';
import { Channel } from '@interfaces/channel';

describe('ChannelService', () => {
  let service: ChannelService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChannelService]
    });
    service = TestBed.inject(ChannelService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('должен быть создан', () => {
    expect(service).toBeTruthy();
  });

  it('должен получать все каналы', () => {
    const mockChannels: Channel[] = [
      { id: 1, name: 'Канал 1' },
      { id: 2, name: 'Канал 2' }
    ];

    service.getChannels().subscribe(channels => {
      expect(channels.length).toBe(2);
      expect(channels).toEqual(mockChannels);
    });

    const req = httpMock.expectOne('http://localhost:3000/channels');
    expect(req.request.method).toBe('GET');
    req.flush(mockChannels);
  });

  it('должен получать канал по id', () => {
    const mockChannel: Channel = { id: 1, name: 'Канал 1' };

    service.getChannelsById(1).subscribe(channel => {
      expect(channel).toEqual(mockChannel);
    });

    const req = httpMock.expectOne('http://localhost:3000/channels/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockChannel);
  });
});
