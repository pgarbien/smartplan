import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {LevelService} from "./level.service";
import {Level} from "./level.model";

@Controller('/locations/:locationId/levels')
export class LevelController {
    constructor(private readonly levelService: LevelService) {
    }

    @Get()
    get(@Param('locationId') locationId: number): Promise<Level[]> {
        const userId = '85046cb4c9dba4e32a624fb0fa80a9bc';
        return this.levelService.getAllByLocationId(userId, locationId);
    }

    @Get('/:id')
    getById(@Param('id') id: number): Promise<Level> {
        const userId = '85046cb4c9dba4e32a624fb0fa80a9bc';
        return this.levelService.getById(userId, id);
    }

    @Post()
    save(@Body() level: Level): Promise<Level> {
        const userId = '85046cb4c9dba4e32a624fb0fa80a9bc';
        return this.levelService.persist(userId, level);
    }

    @Delete('/:id')
    delete(@Param('id') id: number) {
        const userId = '85046cb4c9dba4e32a624fb0fa80a9bc';
        return this.levelService.deleteById(userId, id);
    }
}
