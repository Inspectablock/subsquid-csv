import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class Transaction {
    constructor(props?: Partial<Transaction>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: false})
    hash!: string

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: false})
    block!: number

    @Column_("text", {nullable: true})
    contract!: string | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    transactionFee!: bigint

    @Column_("text", {nullable: false})
    to!: string

    @Column_("text", {nullable: false})
    from!: string

    @Column_("text", {nullable: false})
    func!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    value!: bigint
}
