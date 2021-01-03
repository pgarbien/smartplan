import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {Observable} from "rxjs";
import AuthService from "./auth/auth.service";


@Injectable()
export class AuthInterceptor implements NestInterceptor {
    constructor(private readonly authService: AuthService) {
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        request.userId = this.authService.getLoggedUserByToken(request.headers['authorization'].replace("Bearer ", "")).id;

        return next.handle();
    }
}