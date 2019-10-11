/*
SPDX-License-Identifier: Apache-2.0
updateed: 08-10-2019 3:18
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
     * @param {String} timeStamp 
     * @param {String} requesterObj 
     * @param {String} supplierObj 
     * @param {String} productObj 
     * @param {String} description 
     */ 
    async requestTransaction(ctx, timeStamp, requesterObj, supplierObj, productObj, description) {
        // parse all JSON string to JSON object
        requesterObj = JSON.parse(requesterObj);
        console.log(typeof requesterObj);

        // 1. generate key = userId + timestamp
        let cbtId = requesterObj.bankAccount.accountNo + timeStamp;

        if(supplierObj == null){
            return JSON.stringify({"response": "atleast 1 supplier details are required  for CBT."});
        }
        else{ supplierObj = JSON.parse(supplierObj); }

        if(productObj == null){
            return JSON.stringify({"response": "atleast 1 product details are required  for CBT."});
        }
        else{ productObj = JSON.parse(productObj); }

        // define transporterObj, monetaryStatus, productStatus, transactionStatus with null
        let transporterObj = {"id": null, "name": null, "address": null, "charges": null};
        let monetaryStatus = {"from": null, "to": null, "amount": null};
        let productStatus = {"state": null, "holder": null, "location": null};
        let transactionStatus = {"transactionState": 1, "description": description, "supplierApproval":null, "receiversBankApproval":null};  // 1: REQUESTED

        let cbtObj = Cbt.createInstance(cbtId, timeStamp, requesterObj, supplierObj, productObj, transporterObj, monetaryStatus, productStatus, transactionStatus);
        if(cbtObj != null){ console.log('new transaction request created successfully.'); }

        // add into world state
        await ctx.cbtList.addTransaction(cbtObj);

        // return created object as Response
        return cbtObj;
    }

    /**
     * function to take approval from supplier for perticiuar transaction
     * @param {Context} ctx 
     * @param {String} name 
     * @param {String} txnId 
     * @param {String} supplierApproval 
     * @param {String} transporterObj 
     * @param {String} productStatus 
     * @param {String} transactionState 
     * @param {String} description 
     */
    async setProductSupplierApproval(ctx, name, txnId, supplierApproval, transporterObj, productStatus, transactionState, description) {
        
        // 1. retrieve object associated with given cbtObjKey
        let cbtObjKey = Cbt.makeKey([name, txnId]);
        let cbtObj = await ctx.cbtList.getTransaction(cbtObjKey);
        
        // 2. check wheather cbtObj is present / Not
        if(cbtObj == null) {
            return JSON.stringify({"response": "CBT with ID " + cbtObjKey + " not present in world state!"});
        }

        // parse all JSON string to JSON object
        transporterObj = JSON.parse(transporterObj);
        productStatus = JSON.parse(productStatus);
        
        // 3. update transaction status to : inProcess and supplierApproval = true
        cbtObj.setSupplierApproval(supplierApproval);
        cbtObj.setTransactionDescription(description);
        
        if(supplierApproval == "false") {
            // update transaction object into world state
            await ctx.cbtList.updateTransaction(cbtObj);
            return cbtObj;
        }

        // 4. update productStatus details
        cbtObj.setProductStatus(productStatus.state, productStatus.holder, productStatus.location);

        // 5. update transporterObj details
        cbtObj.setTransporterObject(transporterObj.id, transporterObj.name, transporterObj.address, transporterObj.charges);

        // 6. update transaction state
        cbtObj.setTransactionState(transactionState);

        // 7. update transaction object into world state
        await ctx.cbtList.updateTransaction(cbtObj);

        // 8. return updated object as a response
        return cbtObj;
    }

     /**
      * take approval from receiver's bank.
      * @param {Context} ctx 
      * @param {String} name 
      * @param {String} txnId 
      * @param {String} monetaryStatus 
      * @param {String} receiversBankApproval 
      * @param {String} description 
      */
    async setReceiversBankApproval(ctx, name, txnId, monetaryStatus, receiversBankApproval, description) {
        // 1. retrieve object associated with given cbtObjKey
        let cbtObjKey = Cbt.makeKey([name, txnId]);
        let cbtObj = await ctx.cbtList.getTransaction(cbtObjKey);
        
        // 2. check wheather cbtObj is present / Not
        if(cbtObj == null) {
            return JSON.stringify({"response": "CBT with ID " + cbtObjKey + " not present in world state!"});
        }

        // parse all JSON string to JSON object
        monetaryStatus = JSON.parse(monetaryStatus);


        // 3. check supplierApproval, if it is true then process forword
        // otherwise stop process 
        if(cbtObj.getSupplierApproval() == "false") {
            // update transaction object into world state
            await ctx.cbtList.updateTransaction(cbtObj);
            return cbtObj;
        }

        // 4. bank will decide this option after amount transaction from client bank account to bank's pool account
        cbtObj.setReceiversBankApproval(receiversBankApproval);
        cbtObj.setTransactionDescription(description);
        
        if(receiversBankApproval == "false") {
             // update transaction object into world state
            await ctx.cbtList.updateTransaction(cbtObj);
            return cbtObj;
        }

        // 5. update monetaryStatus
        cbtObj.setMonetaryStatus(monetaryStatus.to, monetaryStatus.from, monetaryStatus.amount);

        // 6. update transaction object into world state
        await ctx.cbtList.updateTransaction(cbtObj);

        // 7. return updated object
        return cbtObj;
    }

    /**
     * function to transfer product from 1 location to another
     * @param {Context} ctx 
     * @param {String} name 
     * @param {String} txnId 
     * @param {String} from 
     * @param {String} to 
     * @param {String} newLocation 
     */
    async productTransfer(ctx, name, txnId, from, to, newLocation, state) {
        // 1. retrieve object associated with given cbtObjKey
        let cbtObjKey = Cbt.makeKey([name, txnId]);
        let cbtObj = await ctx.cbtList.getTransaction(cbtObjKey);
        
        // 2. check wheather cbtObj is present / Not
        if(cbtObj == null) {
            return JSON.stringify({"response": "CBT with ID " + cbtObjKey + " not present in world state!"});
        }

        // 3. check bankApproval, if it is true then process forword
        // otherwise stop process and 
        if(!cbtObj.getReceiversBankApproval()) {
            return JSON.stringify({"response": "receiver\'s bank is not approving for this transaction (" + cbtObjKey + "), status: transaction failed."});
        }

        // 4. update product status
        // 4.1 check wheather from party is a holder or not
        if(cbtObj.getProductHolder() != from) {
            return JSON.stringify({"response": "permission denied to update transfer product status, as this organization is not holding this product."});
        }
        // 4.2 set new asset holder
        cbtObj.setProductHolder(to);

        // 4.3 set new product location
        cbtObj.setProductLocation(newLocation);

        // 4.4 update product state
        if(state == "3"){ cbtObj.setProductState(3); }

        // 5. update transaction object into world state
        await ctx.cbtList.updateTransaction(cbtObj);

        // 6. return modified object
        return cbtObj;
    }

    /**
     * update product delivery status
     * @param {Context} ctx 
     * @param {String} name 
     * @param {String} txnId 
     * @param {String} status 
     */
    async updateProductDeliveryStatus(ctx, name, txnId, status, description) {
        // 1. retrieve object associated with given cbtObjKey
        let cbtObjKey = Cbt.makeKey([name, txnId]);
        let cbtObj = await ctx.cbtList.getTransaction(cbtObjKey);
        
        // 2. check wheather cbtObj is present / Not
        if(cbtObj == null) {
            return JSON.stringify({"response": "CBT with ID " + cbtObjKey + " not present in world state!"});
        }

        // 3. check previous product status
        if(cbtObj.getProductState() == 3) {
            // update product state
            // if true then delivered, else do nothing
            if(status == "4"){ cbtObj.setProductState(4); }
            else if(status == "5"){ cbtObj.setProductState(5); }
            cbtObj.setTransactionDescription(description);
        }
        else{ 
            return JSON.stringify({"response": "CBT with ID " + cbtObjKey + "  not transported yet.!"});
        }

        // 4. update transaction object into world state
        await ctx.cbtList.updateTransaction(cbtObj);

        // 5. return modified object
        return cbtObj;
    }

    /**
     * order fulfillment function
     * @param {Context} ctx 
     * @param {String} name 
     * @param {String} txnId 
     * @param {String} monetaryStatus 
     * @param {String} transactionStatus 
     * @param {String} description 
     */
    async orderFulfillment(ctx, name, txnId, monetaryStatus, transactionState, description) {
        // 1. retrieve object associated with given cbtObjKey
        let cbtObjKey = Cbt.makeKey([name, txnId]);
        let cbtObj = await ctx.cbtList.getTransaction(cbtObjKey);
        
        // 2. check wheather cbtObj is present / Not
        if(cbtObj == null) {
            return JSON.stringify({"response": "CBT with ID " + cbtObjKey + " not present in world state!"});
        }

        // parse all JSON string to JSON object
        monetaryStatus = JSON.parse(monetaryStatus);


        // 3. check wheather product is delivered / not
        if(cbtObj.getProductState() != 4) {
            return JSON.stringify({"response": "product not successfully delivered yet. order fulfillment failed."});
        }

        // 4. fulfill the order
        // 4.1 update monetary status : 
        // if success: transfer amount from receiver's bank's pool account to product supplier's account.
        // if failure: transfer amount from receiver's bank's pool account to product receivers's account.
        cbtObj.setMonetaryStatus(monetaryStatus.to, monetaryStatus.from, monetaryStatus.amount);

        // 4.2 update transaction status: change state
        if(transactionState == "4"){cbtObj.setTransactionState(4); }
        else if(transactionState == "5"){cbtObj.setTransactionState(5); }
        
        // 4.3 update transaction description
        cbtObj.setTransactionDescription(description);

        // 5. update transaction object into world state
        await ctx.cbtList.updateTransaction(cbtObj);

        // 6. return modified object
        return cbtObj;
    }

    /**
     *  get CBT
     * @param {Context} ctx 
     * @param {String} name 
     * @param {String} txnId 
     */
    async getCbt(ctx, name, txnId) {
        // 1. retrieve object associated with given cbtObjKey
        let cbtObjKey = Cbt.makeKey([name, txnId]);
        console.log(`original cbt object key: ${cbtObjKey} type: ${typeof cbtObjKey}`);

        let cbtObj = await ctx.cbtList.getTransaction(cbtObjKey);
        
        // 2. check wheather cbtId is present / Not
        if(cbtObj == null) {
            return JSON.stringify({"response": "CBT with ID " + cbtObjKey + " not present in world state!"});
        }
        
        // parse object into string
        return cbtObj;
    }
}

module.exports = CbtContract;