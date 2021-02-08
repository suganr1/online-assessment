import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { RegisterService } from "../_services/register.service";
import { NgForm } from '@angular/forms';
import { User } from '../_models/register';
import { first } from "rxjs/operators";
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  hide: boolean = true;
  title: string = 'Registration Page';
  userModel: User = new User();
  userId: number;
  updateText: string;

  stateList: Array<any> = [];
  countryList: Array<any> = [
    {
      id: 1, name: "India", cities: [
        { id: 1001, name: "Chennai" },
        { id: 1002, name: "Mumbai" },
        { id: 1003, name: "Delhi" },
        { id: 1004, name: "Bangalore" }]
    },
    {
      id: 2, name: "USA", cities: [
        { id: 1005, name: "New York" },
        { id: 1006, name: "Utah" },
        { id: 1007, name: "California" },
        { id: 1008, name: "Others" }]
    }
  ];

  constructor(
    private registerService: RegisterService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.clear();
    if (!isNaN(this.activatedRoute.snapshot.params.id) && +this.activatedRoute.snapshot.params.id > 0) {
      this.userId = this.activatedRoute.snapshot.params.id;
      this.loadUserInfo(this.userId);
      this.updateText = 'Update';
    }
  }

  clear() {
    this.updateText = 'Register';
    this.userModel.role = "";
    this.userModel.gender = "";
    this.userModel.state = "";
    this.userModel.country = "";
    this.userId = 0;
  }

  loadState(countryName) {
    console.log("Loading State");

    this.stateList = countryName ? this.countryList.filter(f => f.name === countryName).pop().cities : null;
  }

  loadUserInfo(id) {
    this.registerService.getUserById(id).pipe(first()).subscribe(data => {
      this.userModel = data;
      this.loadState(this.userModel.country);
    }, error => {
      this.alertService.error(error.error.message);
    });
  }

  onSubmit() {
    console.log("Submit Clicked");

    if (this.userId > 0) {
      this.registerService.updateUserById(this.userModel).pipe(first()).subscribe(data => {
        this.alertService.success("User Updated Successfully.", { keepAfterRouteChange: true, autoClose: true });
        const redirect = (this.userModel.role === "Admin") ? '/addQuestions' : '/assessment';
        this.router.navigate([redirect]);
      }, error => {
        this.alertService.error(error.error.message);
      });
    } else {
      this.registerService.register(this.userModel).pipe(first()).subscribe(data => {
        this.alertService.success("User Registered Successfully. Please login", { keepAfterRouteChange: true, autoClose: true });
        this.router.navigate(['/login']);
      }, error => {
        this.alertService.error(error.error.message);
      });
    }
  }

  cancelRegistration() {
    if (this.userId > 0) {
      this.userModel.isEditMode = false;
      this.registerService.loggedUser.subscribe(s => this.userModel = s);
      const redirect = (this.userModel.role === "Admin") ? '/addQuestions' : '/assessment';
      this.router.navigate([redirect]);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
