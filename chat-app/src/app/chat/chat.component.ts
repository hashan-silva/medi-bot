import { Component } from '@angular/core';
import {ChatService} from '../service/chat.service';
import {NgClass, NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatCard} from '@angular/material/card';

@Component({
  selector: 'app-chat',
  imports: [
    NgClass,
    FormsModule,
    NgForOf,
    MatCard
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  messages: { from: string, text: string }[] = [];
  userInput: string = '';
  waitingFor: string | null = null;
  patientData: any = {};
  initialAnalysisDone = false;
  isDataComplete: boolean = false;

  // Define the required fields clearly
  private requiredFields = ['personal_number', 'age', 'gender', 'symptoms', 'duration'];

  constructor(private chatService: ChatService) {}

  public sendMessage() {
    if (!this.userInput.trim()) return;

    const currentUserInput = this.userInput; // Store input before clearing
    this.messages.push({ from: 'user', text: currentUserInput });
    this.userInput = ''; // Clear input immediately
    if (!this.initialAnalysisDone) {
      // Analyze the first message
      this.chatService.analyzeMessage(currentUserInput).subscribe(response => {
        this.patientData = response;
        this.initialAnalysisDone = true;
        this.askNextMissingField();
      });
    } else {
      // Store answer for missing field
      if (this.waitingFor) {
        this.patientData[this.waitingFor] = currentUserInput;
        this.waitingFor = null;
        this.askNextMissingField();
      }
    }

    this.userInput = '';
  }

  private askNextMissingField() {
    const questions: { [key: string]: string } = { // Use an object for easier lookup
      personal_number: 'Could you provide your personal number?',
      age: 'May I know your age?',
      gender: 'What is your gender?',
      symptoms: 'Can you describe your symptoms?',
      duration: 'How long have you had these symptoms?'
    };

    for (let key of this.requiredFields) {
      if (!this.patientData[key] || this.patientData[key] === 'missing' || String(this.patientData[key]).trim() === '') {
        this.messages.push({ from: 'bot', text: questions[key] });
        this.waitingFor = key;
        this.isDataComplete = false; // Data is not complete yet
        return; // Ask only one question at a time
      }
    }

    // All required info collected if loop completes without returning
    this.messages.push({ from: 'bot', text: 'Thank you! All required information has been collected. You can now generate the report.' });
    this.isDataComplete = true; // Set flag to true
    this.waitingFor = null; // Ensure we are not waiting for anything else
  }

  public generateReport() {
    if (!this.isDataComplete) {
      console.warn('Attempted to generate report before data collection was complete.');
      // Optionally add a message to the user
      // this.messages.push({ from: 'bot', text: 'Please ensure all information is provided before generating the report.' });
      return;
    }
    this.messages.push({ from: 'bot', text: 'Generating your report...' });
    this.chatService.generatePdf(this.patientData).subscribe({
      next: (blob) => {
        try {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'patient_report.pdf';
          // Append link to body, click it, and then remove it
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          // Release the object URL
          window.URL.revokeObjectURL(url);
          this.messages.push({ from: 'bot', text: 'Report downloaded successfully.' });
        } catch (error) {
          console.error('Error creating download link:', error);
          this.messages.push({ from: 'bot', text: 'Sorry, there was an error preparing the download.' });
        }
      },
      error: (err) => {
        console.error('Error generating PDF:', err);
        this.messages.push({ from: 'bot', text: 'Sorry, there was an error generating the PDF report.' });
      }
    });
  }
}
