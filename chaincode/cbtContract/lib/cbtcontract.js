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
     * create new transaction request by creating new CBT object
     * @param {Context} ctx 
     * @param {String} requesterObj 
     * @param {String} supplierObj 
     * @param {String} productObj 
     * @param {String} description 
     */
    async requestTransaction(ctx, requesterObj, supplierObj, productObj, description) {
        
        // parse all JSON string to JSON object
        requesterObj = JSON.parse(requesterObj);

        // 1. generate key = userId + timestamp
        let timeStamp = "12345";
        console.log(typeof requesterObj);
        let cbtId = requesterObj.bankAccount.accountNo + timeStamp;

        // define transporterObj, monetaryStatus, productStatus, transactionStatus with null
        supplierObj = {"name": null, "address": null, "bankAccount": {"bankName": null, "accountNo": null}}
        let transporterObj = {"name": null, "address": null, "bankAccount": {"bankName": null, "accountNo": null}};
        let monetaryStatus = {"from": null, "to": null, "amount": null};
        let productStatus = {"status": null, "holder": null, "location": null};
        let transactionStatus = {"state": 1, "description": description, "supplierApproval":null, "receiversBankApproval":null};  // 1: REQUESTED

        let cbtObj = Cbt.createInstance(cbtId, timeStamp, requesterObj, supplierObj, productObj, transporterObj, monetaryStatus, productStatus, transactionStatus);
        
        await ctx.cbtList.addTransaction(cbtObj);
        return cbtObj;
    }

    /**
     * take approval from supplier for perticiuar transaction
     * @param {Context} ctx 
     * @param {String} cbtObjKey 
     * @param {String} supplierApproval 
     * @param {String} transporterObj 
     * @param {String} productStatus 
     * @param {String} transactionState 
     * @param {String} description 
     */
    async setProductSupplierApproval(ctx, cbtObjKey, supplierApproval, transporterObj, productStatus, transactionState, description) {
        
        // 1. retrieve object associated with given cbtObjKey
        let cbtObj = await ctx.cbtList.getTransaction(cbtObjKey);
        
        // 2. check wheather cbtObj is present / Not
        if(cbtObj == null) {
            throw new Error ('CBT with ID ' + cbtObjKey + ' not present in world state!');
        }
        

        // 3. update transaction status to : inProcess and supplierApproval = true
        cbtObj.setSupplierApproval(supplierApproval);
        if(supplierApproval == false) {
            cbtObj.setTransactionDescription(description);
            throw new Error ('CBT with ID ' + cbtObjKey + ' rejected by supplier!');
        }

        // 4. update productStatus details
        cbtObj.setProductStatus(productStatus.state, productStatus.holder, productStatus.location);

        // 5. update transporterObj details


        // 6. update transaction object into world state
        await ctx.cbtList.updateTransaction(cbtObj);

        // 7. return modified object
        return cbtObj;

    }

    
    /**
     * take approval from receiver's bank.
     * @param {Context} ctx 
     * @param {String} cbtObjKey 
     * @param {String} monetaryStatus 
     * @param {String} receiversBankApproval 
     * @param {String} description 
     */
    async setReceiversBankApproval(ctx, cbtObjKey, monetaryStatus, receiversBankApproval, description) {
        // 1. retrieve object associated with given cbtObjKey
        let cbtObj = await ctx.cbtList.getTransaction(cbtObjKey);
        
        // 2. check wheather cbtObj is present / Not
        if(cbtObj == null) {
            throw new Error ('CBT with ID ' + cbtObjKey + ' not present in world state!');
        }

        // 3. check supplierApproval, if it is true then process forword
        // otherwise stop process 
        if(!cbtObj.getSupplierApproval()) {

            throw new Error('supplier is not approving for this transaction (' + cbtObjKey + '), status: transaction failed.');
        }

        // 4. bank will decide this option after amount transaction from client bank account to bank's pool account
        cbtObj.setReceiversBankApproval(receiversBankApproval);
        if(receiversBankApproval == false) {
            cbtObj.setTransactionDescription(description);
            // print log message
            console.log('receiver\'s bank is not approving for this transaction (' + cbtObjKey + '), status: transaction failed.');
        }

        // 5. update monetaryStatus
        cbtObj.setMonetaryStatus(monetaryStatus.to, monetaryStatus.from, monetaryStatus.value);

        // 6. update transaction object into world state
        await ctx.cbtList.updateTransaction(cbtObj);

        // 7. return updated object
        return cbtObj;
    }

    async productTransfer(ctx, cbtObjKey, from, to, newLocation) {
        // 1. retrieve object associated with given cbtObjKey
        let cbtObj = await ctx.cbtList.getTransaction(cbtObjKey);
        
        // 2. check wheather cbtObj is present / Not
        if(cbtObj == null) {
            throw new Error ('CBT with ID ' + cbtObjKey + ' not present in world state!');
        }

        // 3. check bankApproval, if it is true then process forword
        // otherwise stop process and 
        if(!cbtObj.getReceiversBankApproval()) {
            throw new Error('receiver\'s bank is not approving for this transaction (' + cbtObjKey + '), status: transaction failed.');
        }

        // 4. update product status
        // 4.1 check wheather from party is a holder or not
        if(cbtObj.getProductStatus.getHolder() != from) {
            throw new Error('permission denied to update transfer product status, as this organization is not holding this product.');
        }
        // 4.2 set new asset holder
        cbtObj.setProductHolder(to);

        // 4.3 set new product location
        cbtObj.setProductLocation(newLocation);

        // 5. update transaction object into world state
        await ctx.cbtList.updateTransaction(cbtObj);

        // 6. return modified object
        return cbtObj;
    }

    async updateProductDeliveryStatus(ctx, cbtObjKey, status) {
        // 1. retrieve object associated with given cbtObjKey
        let cbtObj = await ctx.cbtList.getTransaction(cbtObjKey);
        
        // 2. check wheather cbtObj is present / Not
        if(cbtObj == null) {
            throw new Error ('CBT with ID ' + cbtObjKey + ' not present in world state!');
        }

        // 3. check previous product status
        if(cbtObj.getProductState() == 3) {
            // update product state
            // if true then delivered, else do nothing
            if(status) { cbtObj.setProductState(4); }
        }
    }

    async orderFulfillment(ctx, cbtObjKey, monetaryStatus, transactionStatus, description) {
        // 1. retrieve object associated with given cbtObjKey
        let cbtObj = await ctx.cbtList.getTransaction(cbtObjKey);
        
        // 2. check wheather cbtObj is present / Not
        if(cbtObj == null) {
            throw new Error ('CBT with ID ' + cbtObjKey + ' not present in world state!');
        }

        // 3. check wheather product is delivered / not
        if(cbtObj.getProductState() != 4) {
            throw new Error('product not delivered yet. order fulfillment call failed.');
        }

        // 4. fulfill the order
        // 4.1 update monetary status : transfer amount from receiver's bank's pool account to product supplier's account.
        cbtObj.setMonetaryStatus(monetaryStatus.to, monetaryStatus.from, monetaryStatus.amount);

        // 4.2 update transaction status state
        cbtObj.transactionStatus.setTransactionState(transactionStatus); 
        
        // 4.3 update transaction description
        cbtObj.transactionStatus.setTransactionDescription(description);
    }

    async getCbt(ctx, name, txnId) {
        // 1. retrieve object associated with given cbtObjKey
        let cbtObjKey = Cbt.makeKey([name, txnId]);
        console.log(`original cbt object key: ${cbtObjKey} type: ${typeof cbtObjKey}`);

        let cbtObj = await ctx.cbtList.getTransaction(cbtObjKey);
        
        // 2. check wheather cbtId is present / Not
        if(cbtObj == null) {
            throw new Error ('CBT with ID ' + cbtObjKey + ' not present in world state!');
        }
        
        // parse object into string
        let result = `name: ${cbtObj.requesterObj.name} address : ${cbtObj.requesterObj.address}`;
        console.log(cbtObj);
        return cbtObj;
    }
}

module.exports = CbtContract;