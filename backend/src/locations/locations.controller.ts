import {Controller, Get, Param, Post} from '@nestjs/common';
import {LocationsService} from "./locations.service";

@Controller('locations')
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) {
    }

    @Get()
    getLocations(){
        return this.locationsService.getLocations();
    }

    @Get('/:id')
    getLocation(@Param('id') id: number) {
        return this.locationsService.getLocationById(id);
    }
}
