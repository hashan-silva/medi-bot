import {Component} from '@angular/core';
import {MatCard, MatCardTitle} from '@angular/material/card';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatInput} from '@angular/material/input';
import {AuthServiceService} from '../service/auth-service.service';
import {Router} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  imports: [
    MatCard,
    MatCardTitle,
    FormsModule,
    MatFormField,
    MatInput,
    MatButton,
    NgIf,
    MatFormFieldModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: any = '';
  password: any = '';
  loading = false;
  errorMessage: string = '';


  constructor(
    private authService: AuthServiceService,
    private router: Router) {
  }

  login() {
    this.loading = true;
    this.errorMessage = '';
    this.authService.login(this.email, this.password).then(() => {
      this.router.navigate(['/chat']);
    }).catch((error) => {
      this.errorMessage = error.message;
      this.loading = false;
    });
  }
}
