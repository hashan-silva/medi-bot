import {TestBed} from '@angular/core/testing';

import {ChatService} from './chat.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('ChatService', () => {
  let service: ChatService;
  let httpTestingController: HttpTestingController;
  const baseAPIUrl = 'http://127.0.0.1:8000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatService]
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
  describe('generatePdf', () => {
    it('should send a POST request to /generate-pdf with patient data and expect a Blob', () => {
      const testPatientData = { name: 'John Doe', age: 30 };
      // Keep the definition of what the blob *should* look like
      const mockBlobContent = 'pdf content';
      const mockBlob = new Blob([mockBlobContent], { type: 'application/pdf' });

      service.generatePdf(testPatientData).subscribe(response => {
        expect(response).toBeInstanceOf(Blob);
        expect(response.type).toBe(mockBlob.type);
        expect(response.size).toBe(mockBlob.size);
      });

      const req = httpTestingController.expectOne(`${baseAPIUrl}/generate-pdf`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(testPatientData);
      expect(req.request.responseType).toBe('blob');

      req.flush(mockBlobContent);
    });
  });
});
