/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// specific classes
const Cbt = require('./cbt.js');
const CbtList = require('./cbtlist.js');

/**
 * A custom context provides easy access to list of all trnsaction records
 */
class CbtContext extends Context {

    constructor() {
        super();
        // All transactions are held in a list of transactions
        this.cbtList = new CbtList(this);
    }
}

/**
 * Define cross border transaction smart contract by extending Fabric Contract class
 *
 */

 class CbtContract extends Contract{
     constructor() {
        // Unique name when multiple contracts per chaincode file
         super('org.worldbank.cbt');
     }

    //  define custom context for CBT
     createContext() {
         return new CbtContext();
     }

    /**
    * instiantiate to perform any setup of the ledger that might be required.
    * @param {Context} ctx the transaction Context
    */ 
    async instantiate(ctx) {
         console.log('instantiate the contract');
     }

    /**
    * request for new CBT
    * @param {Context} ctx the transaction Context
    * @param {Strign} txnId
    * @param {String} requestorObj
    * @param {String} supplierObj
    * @param {String} productId
    * @param {String} quantity
    * @param {String} amount
    * @param {String} TransporterObject
    */ 
    async requestTransaction(ctx, txnId, requestorObj, supplierObj, productId, quantity, amount, TransporterObject) {
        let transaction = Cbt.createInstance(txnId, requestorObj, supplierObj, productId, quantity, amount, TransporterObject);
        
        await ctx.cbtList.addRecord(transaction);
        return transaction;
    }
}

module.exports = CbtContract;