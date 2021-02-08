import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { first } from "rxjs/operators";
import { RegisterService } from "../_services/register.service";

import mockData from "../_mock/questions.json";
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent implements OnInit {
  defaultExamType: string = "";

  showQuestions: Boolean = false;
  examListDropdown = mockData.examList; //string[] = ["Angular", ".Net Framework", "SQL"];

  questionList = [];
  questionListFiltered = [];

  constructor(
    private registerService: RegisterService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.defaultExamType = "";
  }

  loadQuestions(examType) {
    this.showQuestions = false;
    if (examType) {
      console.log(`Loading Questions for ${examType}`);

      this.registerService.getQuestions().toPromise().then(data => {
        this.questionListFiltered = data.filter(f => f.language === examType);
        console.log(this.questionListFiltered);

        this.clearEvent();
        this.showQuestions = this.questionListFiltered.length === 0 ? false : true;
        if (!this.showQuestions) {
          this.alertService.warn(`No Questions Available for ${examType}.\nContact Admin to add questions. `);
        }
      }, error => {

        this.alertService.error(error.error.message);

      });
    }
  }

  onItemChange(ques) {
    console.log(ques);
  }

  checkAllAnswered() {
    if (this.showQuestions && (this.questionListFiltered && this.questionListFiltered.length > 0)) {
      const totalQuestions = this.questionListFiltered.length;
      const answeredQuestions = this.questionListFiltered.filter(f => f.selected).length;
      return !(totalQuestions === answeredQuestions);
    }
    return true;
  }

  clearEvent() {
    if (this.questionListFiltered && this.questionListFiltered.length > 0) {
      this.questionListFiltered.forEach(question => {
        question.selected = null;
      });
    }
  }

  onSubmit() {
    // if (this.questionListFiltered && this.questionListFiltered.length > 0) {
    //   this.questionListFiltered.forEach(question => {
    //     question.correctAnswer === question.selected
    //   });
    // };

    //this.router.navigate(['/summaryPage', { answers: JSON.stringify(this.questionListFiltered) }]);
    //this.router.navigate(['/summaryPage', { answer: this.questionListFiltered }]);


    this.registerService.reviewAnswers(this.questionListFiltered)
      .pipe(first())
      .subscribe(data => {
        console.log(data);
        this.router.navigate(['/summaryPage']);
      }, error => {
        this.alertService.error(error.error.message);
      });
  }
}
