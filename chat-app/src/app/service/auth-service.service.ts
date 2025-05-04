import { Injectable } from '@angular/core';
import {Auth, getIdToken, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private auth:Auth) { }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(){
    return signOut(this.auth);
  }

  async getToken(): Promise<string> {
    const user = this.auth.currentUser;
    return user ? await getIdToken(user) : '';
  }

}
