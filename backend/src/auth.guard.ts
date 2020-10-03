import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import AuthService from "./auth/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        if (this.authService.checkIfLoggedIn(request.headers['authorization'])) {
            return true;
        } else {
            throw new UnauthorizedException()
        }
    }
}
