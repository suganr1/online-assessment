import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RegisterService } from "./_services/register.service";
import { User } from './_models/register';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'online-skill-assessment';
  loggedUser: User;

  constructor(
    private router: Router,
    private registerService: RegisterService) {
    this.registerService.loggedUser.subscribe(s => this.loggedUser = s);
  }

  logout() {
    this.registerService.logout();
    this.router.navigate(['/login']);
  }

  homeRedirect() {
    if (this.loggedUser) {
      this.loggedUser.isEditMode = false;
      const redirect = (this.loggedUser.role === "Admin") ? '/addQuestions' : '/assessment';
      this.router.navigate([redirect]);
    }
    else {
      this.router.navigate(['']);
    }
  }

  editUser() {
    this.loggedUser.isEditMode = true;
    this.router.navigate(['/registration', this.loggedUser.id]);
  }

}
