
import { Routes, RouterModule } from '@angular/router';

import { AssessmentComponent } from './assessment/assessment.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AddQuestionsComponent } from "./add-questions/add-questions.component";
import { SummaryPageComponent } from "./summary-page/summary-page.component";

const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registration', component: RegistrationComponent },
    { path: 'registration/:id', component: RegistrationComponent },
    { path: 'assessment', component: AssessmentComponent },
    { path: 'addQuestions', component: AddQuestionsComponent },
    { path: 'summaryPage', component: SummaryPageComponent }
];

export const appRoutingModule = RouterModule.forRoot(routes);