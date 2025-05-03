import {TestBed} from '@angular/core/testing';

import {ChatService} from './chat.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';

describe('ChatService', () => {
  let service: ChatService;
  let httpTestingController: HttpTestingController;
  const baseAPIUrl = 'http://127.0.0.1:8000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatService, HttpClient]
    });
    service = TestBed.inject(ChatService)
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('analyzeMessage', () => {
    it('should send a POST request to /analyze with the message', () => {
      const testMessage = 'Hello bot';
      const mockResponse = {analysis: 'greeting'};

      service.analyzeMessage(testMessage).subscribe(response => {
        expect(response).toEqual(mockResponse)
      });

      const req = httpTestingController.expectOne(`${baseAPIUrl}/analyze`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({message: testMessage});

      req.flush(mockResponse);
    });
    it('should handle errors from /analyze', () => {
      const testMessage = 'Error test';
      const errorMessage = 'Internal Server Error';
      const status = 500;

      service.analyzeMessage(testMessage).subscribe({
        next: () => fail('should have failed with the 500 error'),
        error: (error) => {
          expect(error.status).toEqual(status);
          expect(error.statusText).toEqual(errorMessage);
        }
      });

      const req = httpTestingController.expectOne(`${baseAPIUrl}/analyze`);
      expect(req.request.method).toBe('POST');

      // Respond with an error
      req.flush(errorMessage, { status, statusText: errorMessage });
    });
  });
});
