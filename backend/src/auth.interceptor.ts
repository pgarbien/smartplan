import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {Observable} from "rxjs";
import AuthService from "./auth/auth.service";


@Injectable()
export class AuthInterceptor implements NestInterceptor {
    constructor(private readonly authService: AuthService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
        const request: Request = context.switchToHttp().getRequest();
        request.headers['user_id'] = this.authService.getLoggedUserByToken(request.headers['authorization']).id;

        return next.handle();
    }
}
