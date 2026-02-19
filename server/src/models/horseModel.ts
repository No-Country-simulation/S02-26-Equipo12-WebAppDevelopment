import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Rider } from './riderModel';
import { HorseMeasurement } from './horseMeasurement';

@Table({
    tableName: 'horses',
    timestamps: true,
    underscored: true       
})

export class Horse extends Model {
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

    @ForeignKey(() => Rider)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare riderId: string;

    //Relacion con Rider
    @BelongsTo(() => Rider)
    declare rider: Rider;

    // Relacion inversa con HorseMeasurement
    @HasMany(() => HorseMeasurement)
    declare horseMeasurements: HorseMeasurement[];
}