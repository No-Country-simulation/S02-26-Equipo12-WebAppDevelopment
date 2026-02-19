import { Table, Column, Model, DataType, ForeignKey,BelongsTo } from 'sequelize-typescript';
import { Rider } from './riderModel';
import { MeasurementType } from './measurementTypesModel';

@Table({
    tableName: 'rider_measurements',
    timestamps: true,
    underscored: true
})

export class RiderMeasurement extends Model{

    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    declare id: string;

    @ForeignKey(() => Rider)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare riderId: string;

    //Relacion con Rider
    @BelongsTo(()=> Rider)
    declare rider: Rider;

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