import { Injectable } from '@nestjs/common';
import {LocationsService} from "../locations/locations.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Location} from "../locations/location.model";
import {MongoRepository, UpdateResult} from "typeorm";
import {DeviceService} from "../device/device.service";
import {Preferences} from "./preferences.model";

@Injectable()
export class PreferencesService {
    constructor(@InjectRepository(Preferences) private readonly preferencesRepository: MongoRepository<Preferences>) {
    }

    public getPreferences(userId: string): Promise<Preferences> {
        return this.preferencesRepository.findOne({"userId": userId});
    }

    public async persist(userId: string, preferences: Preferences): Promise<Preferences> {
        preferences.userId = userId;
        return await this.preferencesRepository.save(preferences)
    }

    public async update(userId: string, preferences: Preferences): Promise<UpdateResult | Preferences> {
        preferences.userId = userId;
        if(preferences.id == null) return await this.preferencesRepository.save(preferences)
        else return this.preferencesRepository.update(preferences.id, preferences);
    }
}
