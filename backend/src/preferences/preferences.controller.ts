import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Post,
    Put,
    Req,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {PreferencesService} from "./preferences.service";
import {Preferences} from "./preferences.model";
import {AuthGuard} from "../auth.guard";
import {ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse} from "@nestjs/swagger";
import {AuthInterceptor} from "../auth.interceptor";
import {UpdateResult} from "typeorm";

@Controller('preferences')
@UseGuards(AuthGuard)
@ApiTags('Preferences')
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@UseInterceptors(AuthInterceptor, ClassSerializerInterceptor)
export class PreferencesController {
    constructor(private readonly preferencesService: PreferencesService) {
    }

    @Get()
    @ApiOkResponse({type: [Preferences]})
    public get(@Req() req): Promise<Preferences> {
        return this.preferencesService.getPreferences(req.userId);
    }

    @Post()
    @ApiOkResponse({type: [Preferences]})
    public save(@Req() req, @Body() preferences: Preferences): Promise<Preferences> {
        return this.preferencesService.persist(req.userId, preferences);
    }

    @Put()
    public update(@Req() req, @Body() preferences: Preferences): Promise<Preferences | UpdateResult> {
        return this.preferencesService.update(req.userId, preferences);
    }
}
