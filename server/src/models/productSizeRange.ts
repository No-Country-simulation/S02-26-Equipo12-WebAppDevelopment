import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from "sequelize-typescript";
import { Product } from "./productModel";
import { MeasurementType } from "./measurementTypesModel";

@Table({
    tableName: 'product_size_ranges',
    timestamps: true,
    underscored: true
})

export class ProductSizeRange extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    declare id: string;

    @ForeignKey(()=> Product)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare productId: string;

    //Relacion con Productos
    @BelongsTo(()=> Product)
    declare product: Product;

    @ForeignKey(()=> MeasurementType)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare measurementTypeId: string;

    // Relacion con MeasurementType
    @BelongsTo(()=> MeasurementType)
    declare measurementType: MeasurementType;


    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare sizeLabel: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    declare minValue: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    declare maxValue: number;
}
