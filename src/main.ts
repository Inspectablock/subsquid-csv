import {TypeormDatabase} from '@subsquid/typeorm-store'
import {Transaction} from './model'
import {processor} from './processor'

import {Database, LocalDest} from '@subsquid/file-store'
import {Column, Table, Types} from '@subsquid/file-store-csv'

const dbOptions = {
    tables: {
      TransfersTable: new Table('transfers.csv', {
        hash: Column(Types.String()),
        block: Column(Types.Numeric()),
        from: Column(Types.String()),
        to: Column(Types.String()),
        value: Column(Types.Numeric()),
        transactionFee: Column(Types.Numeric())
      })
    },
    dest: new LocalDest('./data'),
    chunkSizeMb: .001
}

processor.run(new Database(dbOptions), async (ctx) => {
    const transactions: Transaction[] = []
    for (let c of ctx.blocks) {
        for (let tx of c.transactions) {
            let transactionFee = BigInt(0)
            if (tx.gasUsed !== undefined) {
                transactionFee = tx.gasPrice * tx.gasUsed
            }

            console.log(tx.hash);

            ctx.store.TransfersTable.write({
                hash: tx.hash,
                block: c.header.height,
                from: tx.from.toLowerCase(),
                to: tx.to ? tx.to.toLowerCase() : '',
                value: tx.value,
                transactionFee: transactionFee,
            })
        }
    }
})
