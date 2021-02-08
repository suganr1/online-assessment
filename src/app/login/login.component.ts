import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from "rxjs/operators";

import { RegisterService } from "../_services/register.service";
import { AlertService } from "../_services/alert.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide: boolean = true;
  submitted: boolean = false;

  returnUrl: string;
  title: string = 'Login Page';

  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.registerService.login(this.form.username.value, this.form.password.value)
      .pipe(first())
      .subscribe(data => {
        const redirect = (data.role === "Admin") ? '/addQuestions' : '/assessment';
        this.router.navigate([redirect]);
      }, error => {
        this.alertService.error(error.error.message);
      });
  }

  get form() {
    return this.loginForm.controls;
  }

}