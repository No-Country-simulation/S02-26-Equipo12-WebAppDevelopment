import { Table, Column, Model,DataType } from "sequelize-typescript";       

@Table({
    tableName: 'brand',
    timestamps: true
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
        allowNull: false
    })
    declare name: string;  
}