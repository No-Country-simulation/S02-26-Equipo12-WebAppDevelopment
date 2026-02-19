import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { SubCategory } from "./subCategoryModel";

@Table({
    tableName: 'categories',
    timestamps: true,
    underscored: true
})

export class Category extends Model {
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

    // Relacion inversa con SubCategory
    @HasMany(() => SubCategory)
    declare subCategories: SubCategory[];
}