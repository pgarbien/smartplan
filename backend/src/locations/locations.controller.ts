import {Controller, Get, Param, Post} from '@nestjs/common';
import {LocationsService} from "./locations.service";
import {Location} from "../model/location.model";

@Controller('locations')
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) {
    }

    @Get()
    getLocations(): Location[] {
        // return this.locationsService.getLocations();
        return [this.locationsService.location];
    }

    @Get('/:id')
    getLocation(@Param('id') id: number) {
        return this.locationsService.getLocationById(id);
    }
}
