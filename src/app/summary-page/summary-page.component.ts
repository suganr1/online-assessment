import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { first } from "rxjs/operators";

import { RegisterService } from "../_services/register.service";
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-summary-page',
  templateUrl: './summary-page.component.html',
  styleUrls: ['./summary-page.component.scss']
})
export class SummaryPageComponent implements OnInit {
  reviewAnswers: any;
  totalQuestions: number = 0;
  correctAnswer: number = 0;
  wrongAnswer: number = 0;

  percentage: number = 0;
  title: string = "Test Results"

  constructor(
    private registerService: RegisterService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getReviewAnswers();
  }

  getReviewAnswers() {
    this.registerService.reviewAnswersGet()
      .pipe(first())
      .subscribe(data => {
        if (data) {

          console.log(data);
          this.reviewAnswers = data;

          this.totalQuestions = data.length;
          this.correctAnswer = data.filter(f => f.correctAnswer === f.selected).length;
          this.wrongAnswer = data.filter(f => f.correctAnswer !== f.selected).length;

          this.percentage = +((this.correctAnswer / this.totalQuestions) * 100).toFixed();
        }
      }, error => {
        this.alertService.error(error.error.message);
      });
  }

  goToHome() {
    this.registerService.reviewAnswersClear();
    this.router.navigate(['/assessment']);
  }
}
