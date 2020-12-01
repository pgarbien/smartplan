import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Headers,
    Param,
    Post,
    Put, Req,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {LocationsService} from "./locations.service";
import {Location} from "./location.model";
import {AuthGuard} from "../auth.guard";
import {AuthInterceptor} from "../auth.interceptor";
import {UpdateResult} from "typeorm";
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiHeaders,
    ApiHideProperty,
    ApiOkResponse, ApiTags,
    ApiUnauthorizedResponse
} from "@nestjs/swagger";

@Controller('locations')
@UseGuards(AuthGuard)
@ApiTags('Locations')
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@UseInterceptors(AuthInterceptor, ClassSerializerInterceptor)
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) {
    }

    @Get()
    @ApiOkResponse({type: [Location]})
    get(@Req() req): Promise<Location[]> {
        return this.locationsService.getAll(req.userId);
    }

    @Get('/:id')
    @ApiOkResponse({type: Location})
    getLocation(@Req() req, @Param('id') id: string): Promise<Location> {
        return this.locationsService.getById(req.userId, id);
    }

    @Post()
    @ApiCreatedResponse({type: Location})
    save(@Req() req, @Body() location: Location): Promise<Location> {
        return this.locationsService.persist(req.userId, location);
    }

    @Put("/:id")
    @ApiOkResponse({type: UpdateResult})
    update(@Req() req, @Body() location: Location): Promise<UpdateResult> {
       return this.locationsService.update(req.userId, location);
    }

    @Delete('/:id')
    delete(@Req() req, @Param('id') id: string) {
        return this.locationsService.deleteById(req.userId, id);
    }
}
