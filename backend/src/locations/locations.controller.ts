import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {LocationsService} from "./locations.service";
import {Location} from "./location.model";
import {AuthGuard} from "../auth.guard";

@Controller('locations')
@UseGuards(AuthGuard)
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) {
    }


    @Get()
    get(): Location[] {
        return [this.locationsService.location];
    }

    @Get('/:userId/:id')
    getLocation(@Param('userId') userId: string, @Param('id') id: number): Promise<Location> {
        return this.locationsService.getById(userId,id);
    }

    @Post()
    save(@Body() location: Location): Promise<Location> {
        return this.locationsService.persist(location);
    }

}
