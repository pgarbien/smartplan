import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {LocationsService} from "./locations.service";
import {Location} from "./location.model";

@Controller('locations')
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) {
    }


    @Get()
    async get(): Promise<Location[]> {
        return await this.locationsService.get();
    }

    @Get('/:id')
    getLocation(@Param('id') id: number) {
        return this.locationsService.getLocationById(id);
    }

    @Post()
    save(@Body() location: Location): Promise<Location> {
        return this.locationsService.persist(location);
    }

}
