import { Table, Column, Model, DataType, BelongsTo, ForeignKey, HasMany } from "sequelize-typescript";
import { Category } from "./categoryModel";
import { Product } from "./productModel";
import { CategoryRequirement } from "./categoryRequirement";

@Table({
    tableName: 'sub_categories',
    timestamps: true,
    underscored: true
})  

export class SubCategory extends Model {
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

    // Clave Foranea hacia la tabla Category

    @ForeignKey(() => Category)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare categoryId: string;

    // Relacion con Category
    @BelongsTo(() => Category)
    declare category: Category;

    // Relaciones inversas
    @HasMany(() => Product)
    declare products: Product[];

    @HasMany(() => CategoryRequirement)
    declare categoryRequirements: CategoryRequirement[];
}
