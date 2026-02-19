import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { Horse } from "./horseModel";
import { RiderMeasurement } from "./riderMeasurement";

@Table({
    tableName: 'riders',
    timestamps: true,
    underscored: true
})


export class Rider extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    declare id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare lastName: string;

    @Column({
        type: DataType.DATE, 
        allowNull: false,
    })
    declare birthDate: Date;

    @Column({
        type: DataType.ENUM('male', 'female'),
        allowNull: false,
    })
    declare gender: 'male' | 'female';

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        validate:{
            isEmail: true
        }
    })
    declare email: string;

    @Column({
        type:DataType.STRING,
        allowNull: false,
    })
    declare password: string;

    // Relaciones inversas
    @HasMany(() => Horse)
    declare horses: Horse[];

    @HasMany(() => RiderMeasurement)
    declare riderMeasurements: RiderMeasurement[];
}