import { Injectable } from '@nestjs/common';
import {Repository} from "typeorm";
import {Level} from "./level.model";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class LevelService {
    constructor(@InjectRepository(Level) private levelRepository: Repository<Level>) {}

    findAll(): Promise<Level[]> {
        return this.levelRepository.find();
    }
}
