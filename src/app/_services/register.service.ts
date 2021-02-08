import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../_models/register";
import { Question } from "../_models/question";

@Injectable({ providedIn: 'root' })

export class RegisterService {
    private loggedUserSubject: BehaviorSubject<User>;
    public loggedUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.loggedUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('loggedUser')));
        this.loggedUser = this.loggedUserSubject.asObservable();
    }

    register(user: User) {
        return this.http.post(`/users/register`, user);
    }

    login(username: string, password: string) {
        return this.http.post<any>(`/users/authenticate`, { username, password })
            .pipe(map(user => {
                if (user) {
                    localStorage.setItem('loggedUser', JSON.stringify(user));
                    this.loggedUserSubject.next(user);
                    console.log(user);
                }

                return user;
            }));
    }

    getUserById(id: number) {
        return this.http.get<User>(`/getUserById/${id}`);
    }

    getQuestions() {
        return this.http.get<any>(`/questions`);
    }

    reviewAnswers(questionAnswers: any) {
        return this.http.post(`/reviewAnswers`, questionAnswers);
    }

    reviewAnswersGet() {
        return this.http.get<any>(`/reviewAnswersGet`);
    }

    reviewAnswersClear() {
        localStorage.removeItem('reviewAnswers');
    }

    getQuestionsFromDatabase() {
        return this.http.get<any>(`/questionsFromDatabaseGet`);
    }

    insertQuestionsToDatabase(question: any) {
        return this.http.post(`/insertQuestionsToDatabase`, question);
    }

    updateUserById(user: User) {
        //return this.http.post(`/updateUserById`, user);

        return this.http.post<any>(`/updateUserById`, { user })
            .pipe(map(user => {
                if (user) {
                    localStorage.setItem('loggedUser', JSON.stringify(user));
                    this.loggedUserSubject.next(user);
                    console.log(user);
                }

                return user;
            }));
    }

    deleteQuestionsToDatabase(question: any) {
        return this.http.post(`/deleteQuestionsToDatabase`, question);
    }

    logout() {
        localStorage.removeItem('loggedUser');
        this.reviewAnswersClear();
        this.loggedUserSubject.next(null);
    }

    public get loggedUserValue(): User {
        return this.loggedUserSubject.value;
    }
}