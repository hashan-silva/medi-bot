import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private baseAPIUrl = 'http://127.0.0.1:8000';

  constructor(
    private httpClient: HttpClient
  ) {
  }

  analyzeMessage(message: string): Observable<any> {
    return this.httpClient.post(`${this.baseAPIUrl}/analyze`, {message});
  }

  generatePdf(patientData: any): Observable<Blob> {
    return this.httpClient.post(`${this.baseAPIUrl}/generate-pdf`, patientData, { responseType: 'blob' });
  }
}
