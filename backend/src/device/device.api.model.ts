import {ActionType} from "./device.supla.model";

export interface DeviceQuery {
    locationId: string;
    levelId: string;
    roomId: string;
}

export class ActionTypeRequest {
    // @ApiProperty({
    //     type: () => ActionType
    // })
    actionType: ActionType;
}
