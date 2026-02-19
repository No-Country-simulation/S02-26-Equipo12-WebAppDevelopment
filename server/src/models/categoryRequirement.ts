import { Table, Column, Model, DataType, BelongsTo, ForeignKey} from "sequelize-typescript";
import { SubCategory } from "./subCategoryModel";
import { MeasurementType } from "./measurementTypesModel";

@Table({
    tableName: 'cat_req_measurements',
    timestamps: true,
    underscored: true
})

export class CategoryRequirement extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    declare id: string;

    @ForeignKey(()=> SubCategory)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare subCategoryId: string;

    @BelongsTo(()=> SubCategory)
    declare subCategory: SubCategory;

    @ForeignKey(()=> MeasurementType)
        @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare measurementTypeId: string;

    @BelongsTo(()=> MeasurementType)
    declare measurementType: MeasurementType;

}