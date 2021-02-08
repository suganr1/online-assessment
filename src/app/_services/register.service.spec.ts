import { TestBed, async, inject } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

import { RegisterService } from "./register.service";
import { HttpClient } from "@angular/common/http";
import { User } from "../_models/register";

describe('RegisterService', () => {
    let service: RegisterService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [RegisterService]
        });
        service = TestBed.inject(RegisterService);
        httpMock = TestBed.get(HttpTestingController);
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should execute - register', async(inject([HttpTestingController, RegisterService],
        (HttpClient: HttpTestingController, registerSerice: RegisterService) => {
            const postItem = new User();

            postItem.id = 1;
            postItem.name = "name";
            postItem.userName = "name";
            postItem.password = "pass";
            postItem.confirmPassword = "pass";

            registerSerice.register(postItem).subscribe((posts: any) => {
                expect(posts.length).toBe(1);
            });
        })));

    it('should execute - login', async(inject([HttpTestingController, RegisterService],
        (HttpClient: HttpTestingController, registerSerice: RegisterService) => {
            expect(registerSerice.login('user', 'pass')).toBeDefined();
        })));

    it('should execute - reviewAnswers', async(inject([HttpTestingController, RegisterService],
        (HttpClient: HttpTestingController, registerSerice: RegisterService) => {
            const postItem = {};

            postItem["question"] = "Dummy question";
            postItem["correctAnswer"] = "answer";
            postItem["language"] = "language";

            registerSerice.reviewAnswers(postItem).subscribe((posts: any) => {
                expect(posts.length).toBe(1);
            });
        })));

    it('should execute - insertQuestionsToDatabase', async(inject([HttpTestingController, RegisterService],
        (HttpClient: HttpTestingController, registerSerice: RegisterService) => {
            const postItem = {};

            postItem["question"] = "Dummy question";
            postItem["correctAnswer"] = "answer";
            postItem["language"] = "language";
            postItem["id"] = 0;

            registerSerice.insertQuestionsToDatabase(postItem).subscribe((posts: any) => {
                expect(posts.length).toBe(1);
            });
        })));

    // it('should execute - deleteQuestionsToDatabase', async(inject([HttpTestingController, RegisterService],
    //     (HttpClient: HttpTestingController, registerSerice: RegisterService) => {
    //         const postItem = {};

    //         postItem["id"] = 0;

    //         registerSerice.deleteQuestionsToDatabase(postItem).subscribe((posts: any) => {
    //             expect(posts.length).toBe(0);
    //         });
    //     })));

    it('should execute - getQuestions', async(inject([HttpTestingController, RegisterService],
        (HttpClient: HttpTestingController, registerSerice: RegisterService) => {
            expect(registerSerice.getQuestions()).toBeDefined();
        })));

    it('should execute - reviewAnswersGet', async(inject([HttpTestingController, RegisterService],
        (HttpClient: HttpTestingController, registerSerice: RegisterService) => {
            expect(registerSerice.reviewAnswersGet()).toBeDefined();
        })));

    it('should execute - reviewAnswersClear', async(inject([HttpTestingController, RegisterService],
        (HttpClient: HttpTestingController, registerSerice: RegisterService) => {
            expect(registerSerice.reviewAnswersClear()).toBeUndefined();
        })));

    it('should execute - getQuestionsFromDatabase', async(inject([HttpTestingController, RegisterService],
        (HttpClient: HttpTestingController, registerSerice: RegisterService) => {
            expect(registerSerice.getQuestionsFromDatabase()).toBeDefined();
        })));

    it('should execute - logout', async(inject([HttpTestingController, RegisterService],
        (HttpClient: HttpTestingController, registerSerice: RegisterService) => {
            expect(registerSerice.logout()).toBeUndefined();
        })));
})