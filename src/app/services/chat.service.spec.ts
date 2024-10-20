import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChatService } from './chat.service';
import { Message } from '@interfaces/message';

describe('ChatService', () => {
  let service: ChatService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatService]
    });
    service = TestBed.inject(ChatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('должен быть создан', () => {
    expect(service).toBeTruthy();
  });

  it('должен получить сообщения', () => {
    const mockMessages: Message[] = [
      { id: 1, from_user: 1, channel_id: 1, content: 'Привет' },
      { id: 2, from_user: 2, channel_id: 1, content: 'Привет, как дела?' }
    ];

    service.getMessages().subscribe((messages) => {
      expect(messages.length).toBe(2);
      expect(messages).toEqual(mockMessages);
    });

    const req = httpMock.expectOne('http://localhost:3000/messages');
    expect(req.request.method).toBe('GET');
    req.flush(mockMessages);
  });

  it('должен отправить сообщение', () => {
    const newMessage: Partial<Message> = { from_user: 1, channel_id: 1, content: 'Новое сообщение' };
    const mockResponse: Message = { id: 3, from_user: 1, channel_id: 1, content: 'Новое сообщение' };

    service.sendMessage(newMessage).subscribe((message) => {
      expect(message).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/messages');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newMessage);
    req.flush(mockResponse);
  });
});
