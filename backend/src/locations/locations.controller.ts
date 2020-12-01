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
import {AuthInterceptor} from "../auth.interceptor";
import {UpdateResult} from "typeorm";
import {ApiBearerAuth, ApiCreatedResponse, ApiOkResponse} from "@nestjs/swagger";

@Controller('locations')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@UseInterceptors(AuthInterceptor, ClassSerializerInterceptor)
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) {
    }

    @Get()
    @ApiOkResponse({type: [Location]})
    get(@Headers('user_id') userId: string): Promise<Location[]> {
        return this.locationsService.getAll(userId);
    }

    @Get('/:id')
    @ApiOkResponse({type: Location})
    getLocation(@Headers('user_id') userId: string, @Param('id') id: string): Promise<Location> {
        return this.locationsService.getById(userId, id);
    }

    @Post()
    @ApiCreatedResponse({type: Location})
    save(@Headers('user_id') userId: string, @Body() location: Location): Promise<Location> {
        return this.locationsService.persist(userId, location);
    }

    @Put("/:id")
    @ApiOkResponse({type: UpdateResult})
    update(@Headers('user_id') userId: string, @Body() location: Location): Promise<UpdateResult> {
       return this.locationsService.update(userId, location);
    }

    @Delete('/:id')
    delete(@Headers('user_id') userId: string, @Param('id') id: string) {
        return this.locationsService.deleteById(userId, id);
    }
}
