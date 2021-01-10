import {Column, Entity, ObjectID, ObjectIdColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {Exclude, Transform} from "class-transformer";

@Entity()
export class Preferences {
    @ApiProperty({type: () => String})
    @Transform(id => id.toString())
    @ObjectIdColumn()
    id: ObjectID;

    @Exclude()
    @Column()
    userId: string;

    @ApiProperty()
    @Column({
        default: false
    })
    locationAutosaveEnabled: boolean
}