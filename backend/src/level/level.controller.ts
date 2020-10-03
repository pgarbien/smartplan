import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Headers,
    Param,
    Post,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {LevelService} from "./level.service";
import {Level} from "./level.model";
import {AuthGuard} from "../auth.guard";
import {AuthInterceptor} from "../auth.interceptor";

@Controller('/locations/:locationId/levels')
@UseGuards(AuthGuard)
@UseInterceptors(AuthInterceptor, ClassSerializerInterceptor)
export class LevelController {
    constructor(private readonly levelService: LevelService) {
    }

    @Get()
    get(@Headers('user_id') userId: string, @Param('locationId') locationId: number): Promise<Level[]> {
        return this.levelService.getAllByLocationId(userId, locationId);
    }

    @Get('/:id')
    getById(@Headers('user_id') userId: string, @Param('id') id: number): Promise<Level> {
        return this.levelService.getById(userId, id);
    }

    @Post()
    save(@Headers('user_id') userId: string, @Body() level: Level): Promise<Level> {
        return this.levelService.persist(userId, level);
    }

    @Delete('/:id')
    delete(@Headers('user_id') userId: string, @Param('id') id: number) {
        return this.levelService.deleteById(userId, id);
    }
}
