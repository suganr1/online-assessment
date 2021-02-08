import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs";

import { RegisterService } from "../_services/register.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private registerService: RegisterService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let loggedUser = this.registerService.loggedUserValue;
        if (loggedUser) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${loggedUser.name}`
                }
            });
        }
        return next.handle(request);
    }
}