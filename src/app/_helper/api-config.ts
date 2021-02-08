import { Injectable } from "@angular/core";
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { delay, mergeMap, materialize, dematerialize, find } from "rxjs/operators";
import { ok } from "assert";
//import * as questionAnswersMock from "../_mock/questions.json";
import mockData from "../_mock/questions.json";

//import { questions } from "*.json";-

let users = JSON.parse(localStorage.getItem('users')) || [];
let questions = JSON.parse(localStorage.getItem('questions')) || [];

@Injectable()
export class ApiConfigInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;
        let questionAnswers = mockData.questionsAnswersMock;

        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/questions') && method === 'GET':
                    return getQuestions();
                case url.endsWith('/reviewAnswers') && method === 'POST':
                    return reviewAnswers();
                case url.endsWith('/reviewAnswersGet') && method === 'GET':
                    return reviewAnswersGet();
                case url.endsWith('/questionsFromDatabaseGet') && method === 'GET':
                    return getQuestionsFromDatabase();
                case url.endsWith('/insertQuestionsToDatabase') && method === 'POST':
                    return insertQuestionsToDatabase();
                case url.endsWith('/deleteQuestionsToDatabase') && method === 'POST':
                    return deleteQuestionsToDatabase();
                case url.endsWith('/updateUserById') && method === 'POST':
                    return updateUserById();
                case url.match(/\/getUserById\/\d+$/) && method === 'GET':
                    return getUserById();
            }
        }

        function authenticate() {
            const { username, password } = body;
            const findUser = users.find(f => f.userName === username && f.password === password);
            if (findUser) {
                storeSampleQuestion();

                return ok({
                    id: findUser.id,
                    name: findUser.name,
                    username: findUser.userName,
                    role: findUser.role,
                    companyName: findUser.companyName,
                    emailAddress: findUser.emailAddress,
                    contactNumber: findUser.contactNumber
                });
            } else {
                return error('Not a valid user. Please register before Login');
            }
        }

        function register() {
            const user = body;
            const findUser = users.find(f => f.userName === user.userName);

            if (findUser) {
                return error(`Username ${user.userName} is already exists. Try logging in`);
            }

            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));

            return ok();
        }

        function getUserById() {
            const findUser = users.find(f => f.id === idFromUrl());
            return ok(findUser);
        }

        function updateUserById() {
            const user = body.user;
            var cont = true;
            users && users.forEach((element, index) => {
                if (cont && element.id === user.id) {
                    user.isEditMode = false;
                    users[index] = user;
                    cont = false;
                }
            });
            localStorage.setItem('users', JSON.stringify(users));
            return ok(users.find(f => f.id === user.id));
        }

        function getQuestions() {
            // let dynamicAndMock = questionAnswers.concat(questions);
            // return ok(dynamicAndMock);

            return ok(questions);
        }

        function storeSampleQuestion() {
            localStorage.setItem('questionAnswers', JSON.stringify(questionAnswers));
            return ok();
        }

        function reviewAnswers() {
            const reviewAnswers = body;
            localStorage.setItem('reviewAnswers', JSON.stringify(reviewAnswers))
            return ok();
        }

        function reviewAnswersGet() {
            const reviewAnswers = JSON.parse(localStorage.getItem('reviewAnswers')) || [];
            return ok(reviewAnswers);
        }

        function getQuestionsFromDatabase() {
            const getQuestions = JSON.parse(localStorage.getItem('questions')) || [];
            return ok(getQuestions);
        }

        function insertQuestionsToDatabase() {
            const question = body;
            if (question.id > 0) {
                var cont = true;
                questions && questions.forEach((element, index) => {
                    if (cont && element.id === question.id) {
                        questions[index] = question;
                        cont = false;
                    }
                });
                localStorage.setItem('questions', JSON.stringify(questions));
                return ok('Question Updated');
            } else {
                const checkLength = questions;//.filter(f => f.language === question.language);
                let id = 0;
                if (checkLength && checkLength.length > 0) {
                    id = Math.max(...checkLength.map(x => x.id))
                }
                const questionId = questions.length ? id + 1 : 1;
                question["id"] = questionId;

                const findQuestion = questions.find(f => f.question === question.question);

                if (findQuestion) {
                    return error('Question already exists');
                }

                questions.push(question);
                localStorage.setItem('questions', JSON.stringify(questions));
                return ok('Question Added');
            }
        }

        function deleteQuestionsToDatabase() {
            const question = body;
            if (question.id > 0) {
                questions = questions && questions.filter(f => f.id !== question.id);
                localStorage.setItem('questions', JSON.stringify(questions));
                return ok('Question Deleted');
            }
        }

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const apiConfigProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ApiConfigInterceptor,
    multi: true
};
