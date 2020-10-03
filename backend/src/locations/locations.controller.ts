import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Headers,
    Param,
    Post,
    Put,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {LocationsService} from "./locations.service";
import {Location} from "./location.model";
import {AuthGuard} from "../auth.guard";
import AuthService from "../auth/auth.service";
import {AuthInterceptor} from "../auth.interceptor";

@Controller('locations')
@UseGuards(AuthGuard)
@UseInterceptors(AuthInterceptor, ClassSerializerInterceptor)
export class LocationsController {
    constructor(private readonly locationsService: LocationsService, private readonly authService: AuthService) {
    }

    @Get()
    get(@Headers('user_id') userId: string): Promise<Location[]> {
        return this.locationsService.getAll(userId);
    }

    @Get('/:id')
    getLocation(@Headers('user_id') userId: string, @Param('id') id: number): Promise<Location> {
        return this.locationsService.getById(userId, id);
    }

    @Post()
    save(@Headers('user_id') userId: string, @Body() location: Location): Promise<Location> {
        return this.locationsService.persist(userId, location);
    }

    @Put()
    update(@Headers('user_id') userId: string, @Body() location: Location): Promise<Location> {
       return this.locationsService.update(userId, location);
    }

    @Delete('/:id')
    delete(@Headers('user_id') userId: string, @Param('id') id: number) {
        return this.locationsService.deleteById(userId, id);
    }
}
