import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { RiderMeasurement } from './riderMeasurement.ts';
import { HorseMeasurement } from './horseMeasurement';
import { ProductSizeRange } from './productSizeRange.ts';
import { CategoryRequirement } from './categoryRequirement';

@Table({
    tableName: 'measurement_types',
    timestamps: true,
    underscored: true
})

export class MeasurementType extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    declare id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    declare code: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare unit: string;

    @Column({
        type: DataType.ENUM('rider', 'horse', 'other'),
        allowNull: false,
    })
    declare appliesTo: 'rider' | 'horse' | 'other';

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    declare description: string | null;

    // Relaciones inversas
    @HasMany(() => RiderMeasurement)
    declare riderMeasurements: RiderMeasurement[];

    @HasMany(() => HorseMeasurement)
    declare horseMeasurements: HorseMeasurement[];

    @HasMany(() => ProductSizeRange)
    declare productSizeRanges: ProductSizeRange[];

    @HasMany(() => CategoryRequirement)
    declare categoryRequirements: CategoryRequirement[];
}

