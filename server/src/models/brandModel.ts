import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { Product } from "./productModel";

@Table({
    tableName: 'brands',
    timestamps: true,
    underscored: true
})

export class Brand extends Model {
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
    declare name: string;

    // Relacion inversa con Product
    @HasMany(() => Product)
    declare products: Product[];
}