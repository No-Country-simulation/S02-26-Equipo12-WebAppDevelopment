import { Table, Column, Model, DataType, BelongsTo, ForeignKey, HasMany } from "sequelize-typescript";
import { Brand } from "./brandModel";
import { SubCategory } from "./subCategoryModel";
import { ProductSizeRange } from "./productSizeRange";

@Table({
    tableName: 'products',
    timestamps: true,
    underscored: true
})

export class Product extends Model {
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
        type: DataType.TEXT,
        allowNull: true
    })
    declare description: string | null;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare image: string | null;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare price: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    declare stock: number;

    //Clave Foranea hacia la Tabla Brand

    @ForeignKey(() => Brand)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare brandId: string;

    // Relacion con Brand
    @BelongsTo(() => Brand)
    declare brand: Brand;


    // Clave Foranea hacia la Tabla SubCategory

    @ForeignKey(() => SubCategory)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare subCategoryId: string;

    // Relacion con SubCategory
    @BelongsTo(() => SubCategory)
    declare subCategory: SubCategory;

    // Relacion inversa con ProductSizeRange
    @HasMany(() => ProductSizeRange)
    declare productSizeRanges: ProductSizeRange[];
}