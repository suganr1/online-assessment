import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { RegisterService } from "../_services/register.service";
import { first } from "rxjs/operators";

import mockData from "../_mock/questions.json";
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-add-questions',
  templateUrl: './add-questions.component.html',
  styleUrls: ['./add-questions.component.scss']
})
export class AddQuestionsComponent implements OnInit {

  questionsListDatabase = [];
  addMode: boolean = false;
  currentQuestion: any = {};
  examListDropdown = mockData.examList;

  constructor(
    private registerService: RegisterService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.clearQuestion();
    this.listAllQuestions();
  }

  addQuestion() {
    this.addMode = true;
  }

  clearQuestion() {
    this.currentQuestion = { "language": "", "id": 0 };
  }

  cancelQuestion() {
    this.addMode = false;
    this.clearQuestion();
  }

  onSubmit() {
    console.log("Submit Clicked");

    let formQuestion = {
      "correctAnswer": this.currentQuestion.correctAnswer,
      "language": this.currentQuestion.language,
      "question": this.currentQuestion.question,
      "optionList": [
        this.currentQuestion.option1,
        this.currentQuestion.option2,
        this.currentQuestion.option3,
        this.currentQuestion.option4
      ],
      "id": this.currentQuestion.id
    };

    let isValidAnswer = formQuestion.optionList.includes(formQuestion.correctAnswer);
    if (!isValidAnswer) {
      this.alertService.warn(`Correct Answer is not valid.\nCorrect Answer should match any of your options ['${this.currentQuestion.option1}','${this.currentQuestion.option2}','${this.currentQuestion.option3}','${this.currentQuestion.option4}'].`);
      return;
    }

    this.registerService.insertQuestionsToDatabase(formQuestion).pipe(first()).subscribe(data => {
      this.clearQuestion();
      this.cancelQuestion();
      this.listAllQuestions();
    }, error => {
      this.alertService.error(error.error.message);

    });

  }

  listAllQuestions() {
    this.registerService.getQuestionsFromDatabase().toPromise().then(data => {
      this.questionsListDatabase = data;
      console.log(this.questionsListDatabase);
    }, error => {
      this.alertService.error(error.error.message);
    });
  }

  editQuestion(question) {
    this.addMode = true;
    this.currentQuestion["question"] = question.question;
    this.currentQuestion["option1"] = question.optionList[0];
    this.currentQuestion["option2"] = question.optionList[1];
    this.currentQuestion["option3"] = question.optionList[2];
    this.currentQuestion["option4"] = question.optionList[3];
    this.currentQuestion["correctAnswer"] = question.correctAnswer;
    this.currentQuestion["language"] = question.language;
    this.currentQuestion["id"] = question.id;
  }

  deleteQuestion(question) {
    this.registerService.deleteQuestionsToDatabase(question).pipe(first()).subscribe(data => {
      this.alertService.warn(`Question Deleted Successfully.`);
      this.clearQuestion();
      this.cancelQuestion();
      this.listAllQuestions();
    }, error => {
      this.alertService.error(error.error.message);
    });
  }
}
