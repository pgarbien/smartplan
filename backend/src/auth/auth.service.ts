import { Injectable } from '@nestjs/common';
import { AuthProfile } from './supla.strategy';

interface User {
    name: string
}

@Injectable()
export default class AuthService {
  async handlePassportAuth(profile: AuthProfile) {
    // Return the existing user, or create the user entity
    // form profile returned by the OAuth provider
    const user: User = {
        name: profile.name
    };

    // Preform your business logic here

    // Return the user instance
    return user;
  }
}
