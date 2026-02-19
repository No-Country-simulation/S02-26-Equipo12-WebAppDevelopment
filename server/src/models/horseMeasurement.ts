import { Table, Column, Model, DataType, ForeignKey,BelongsTo } from 'sequelize-typescript';
import { MeasurementType } from './measurementTypesModel';
import { Horse } from './horseModel';

@Table({
    tableName: 'horse_measurements',
    timestamps: true,
    underscored: true
})

export class HorseMeasurement extends Model{

    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    declare id: string;

    @ForeignKey(() => Horse)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare horseId: string;

    //Relacion con Horse
    @BelongsTo(()=> Horse)
    declare horse: Horse;

    //  Clave Forarea con MeasurementType
    @ForeignKey(()=> MeasurementType)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare measurementTypeId: string;

    //Relacion con MeasurementType
    @BelongsTo(()=> MeasurementType)
    declare measurementType: MeasurementType;

    @Column({
        type: DataType.DECIMAL(5,2),
        allowNull: false,
    })
    declare value: number;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    })
    declare measurementDate: Date;
}