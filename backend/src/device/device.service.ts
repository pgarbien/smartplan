import {Injectable} from "@nestjs/common";
import {
    Action,
    Device,
    DeviceDetails,
    DeviceState,
    DeviceConfig,
    BaseDevice
} from "./device.model";
import {MongoRepository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {ChannelsService} from "../channels/channels.service";
import devicesConfig from "../../config/devices_config";
import {DeviceQuery} from "./device.api.model";
import {ActionType, DeviceType} from "./device.supla.model";

@Injectable()
export class DeviceService {
    constructor(@InjectRepository(Device) private readonly deviceRepository: MongoRepository<Device>,
                private readonly channelsService: ChannelsService) {
    }

    public save(device: Device): Promise<Device> {
        return this.deviceRepository.save(device);
    }

    public async getAll(userId: string, query: DeviceQuery, token: string): Promise<Device[]> {
        const channels = await this.channelsService.getChannels(userId, token);
        const devices: Device[] = await Promise.all(channels.map(device => this.updateAndGet(this.mapToDevice(device, userId))));

        for await (const device of devices) {
            if (devicesConfig.has(device.type)) {
                await this.setDeviceIconsAndDefaultAction(device, userId, token);
            }
        }

        return devices.filter(device => this.assertQuery(device, query));
    }

    public updateAll(userId: string, devices: Device[], token: string): void {
        devices.forEach(device => this.deviceRepository.update(device.id, device))
    }

    public async getDetails(userId: string, deviceId: string, token: string): Promise<DeviceDetails> {
        const device = await this.deviceRepository.findOne(deviceId);
        const data = await this.channelsService.getChannelById(userId, device.suplaDeviceId, token);
        const deviceDetails: DeviceDetails = this.mapToDeviceDetails(data);

        if (devicesConfig.has(deviceDetails.type)) {
            await this.setDeviceIconsAndDefaultAction(deviceDetails, userId, token);
            this.setStateDetails(deviceDetails);
        }

        return deviceDetails;
    }

    public async callAction(userId: string, deviceId: string, actionType: ActionType, token: string) {
        const device = await this.deviceRepository.findOne(deviceId);
        return this.channelsService.callAction(userId, device.suplaDeviceId, actionType, token);
    }

    public async getStates(userId: string, query: DeviceQuery, token: string): Promise<DeviceState[]> {
        const suplaDevicesWithStates = await this.channelsService.getChannelsWithStates(userId, token);
        const deviceStates: DeviceState[] = await Promise.all(suplaDevicesWithStates.map(device => this.mapToDeviceState(device, userId)));
        const devices = {};

        //TODO think of other model to not make calls to db twice for each device as it is now (because we want the state and locationId etc.. maybe search for device model and only return DeviceState
        for (const deviceState of deviceStates) {
            devices[deviceState.id] = await this.deviceRepository.findOne(deviceState.id, {
                where: {
                    "userId": userId
                }
            });
        }
        return deviceStates.filter(deviceState => this.assertQuery(devices[deviceState.id], query));
    }

    public removeAllFromLevel(userId: string, levelId: string) {
        this.deviceRepository.update({
            userId: userId,
            levelId: levelId
        }, {
            locationId: null,
            levelId: null,
            roomId: null,
            point: null
        })
    }

    public removeAllFromLocation(userId: string, locationId: string) {
        this.deviceRepository.update({
            userId: userId,
            locationId: locationId
        }, {
            locationId: null,
            levelId: null,
            roomId: null,
            point: null
        })
    }

    private async setDeviceIconsAndDefaultAction(device: BaseDevice, userId: string, token: string) {
        const config: DeviceConfig = devicesConfig.get(device.type);
        if(device.suplaIconId == null) {
            device.icons = config.images;
        } else {
            const iconsData = await this.channelsService.getIconById(userId, device.suplaIconId, token);
            device.icons = iconsData[0].images;
        }
        device.defaultAction = config.defaultAction;
    }

    private setStateDetails(device: DeviceDetails) {
        const config: DeviceConfig = devicesConfig.get(device.type);
        device.stateDetails = config.stateDetails;
    }

    private assertQuery(device: Device, query: DeviceQuery): boolean {
        return (query.roomId != null && device.roomId == query.roomId)
            || (query.levelId != null && query.roomId == null && device.levelId == query.levelId)
            || (query.locationId != null && query.roomId == null && query.levelId == null && device.locationId == query.locationId)
            || (query.locationId == null && query.levelId == null && query.roomId == null)
    }

    private async mapToDeviceState(suplaDevice, userId): Promise<DeviceState> {
        const device = await this.deviceRepository.findOne({
            suplaDeviceId: suplaDevice.id,
            userId: userId
        });

        let config: DeviceConfig = null;
        if(devicesConfig.has(device.type)) {
            config = devicesConfig.get(device.type);
        }

        return new DeviceState(device.id.toString(), suplaDevice.state, config != null ? config.stateDetails : new Map());
    }

    private mapToDevice(suplaDevice, userId): Device {
        return new Device(
            userId,
            suplaDevice.id,
            suplaDevice.caption != null ? suplaDevice.caption : `ID${suplaDevice.id} ${suplaDevice.function.caption}`,
            suplaDevice.userIconId,
            DeviceType[suplaDevice.function.name],
            suplaDevice.function.possibleVisualStates
        );
    }

    private mapToDeviceDetails(suplaDevice): DeviceDetails {
        const details = suplaDevice.function;
        return new DeviceDetails(
            DeviceType[details.name],
            details.caption,
            details.possibleActions.map(data => new Action(ActionType[data.name], data.caption)),
            suplaDevice.state,
            suplaDevice.userIconId,
            details.possibleVisualStates
        );
    }

    //TODO refactor to try to make less calls to db
    private async updateAndGet(device: Device): Promise<Device> {
        this.deviceRepository.findOne({
            suplaDeviceId: device.suplaDeviceId,
            userId: device.userId
        }).then(
            async dbDevice => {
                if (dbDevice == undefined) {
                    await this.deviceRepository.save(device)
                } else {
                    await this.deviceRepository.update({
                        userId: device.userId,
                        suplaDeviceId: device.suplaDeviceId
                    }, {
                        name: device.name,
                        suplaIconId: device.suplaIconId,
                        type: device.type,
                        possibleVisualStates: device.possibleVisualStates
                    });
                }
            }
        );

        return this.deviceRepository.findOne({
            suplaDeviceId: device.suplaDeviceId,
            userId: device.userId
        });
    }
}
