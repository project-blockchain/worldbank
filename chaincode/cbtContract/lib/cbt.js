/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate cross border transaction state values
const cbtState = {
    REQUESTED: 1,
    INPROCESS: 2,
    DELIVERED: 3,
    SUCCESSFUL: 4,
    FAILED: 5
};

// enumerate for product state
const productState = {
    NOTREADY: 1,
    SUPPLIED: 2,
    TRANSPORTED: 3,
    DELIVERED: 4
};

/**
 * Cbt class extends State class
 * Class will be used by application and smart contract to define a cross border transaction object
 */

class Cbt extends State {
    constructor(obj) {
        super(Cbt.getClass(), [obj.requesterObj.name, obj.txnId]);
        Object.assign(this, obj);
    }

    //  getters and setters
    // 1. requesoter

    // 2. supplier

    // 3. transporter

    // 4. monetaryStatus
    getmonetaryStatus() {
        return this.monetaryStatus;
    }
    
    setMoneratyStatus(to, from, amount) {
        this.monetaryStatus.to = to;
        this.monetaryStatus.from = from;
        this.monetaryStatus.amount = amount;    
    }

    // 5. product status
    setProductState(state) {
        this.productStatus.productState = state;
    }
    setProductHolder(holder) {
        this.productStatus.holder = holder;
    }
    setProductLocation(location) {
        this.productStatus.location = location;
    }
    setProductStatus(state, holder, location) {
        setProductState(state);
        setProductHolder(holder);
        setProductLocation(location);
    }

    // 6. transaction status
    getTransactionState() {
        return this.transactionStatus.transactionState;
    }
    getTransactionDescription() {
        return this.transactionStatus.description;
    }
    getSupplierApproval(){
        return this.transactionStatus.supplierApproval;
    }
    getReceiversBankApproval(){
        return this.transactionStatus.receiversBankApproval;
    }

    setTransactionState(state) {
        this.transactionStatus.transactionState = state;
    }
    setTransactionDescription(description) {
        this.transactionStatus.description = description;
    }
    setSupplierApproval(value){
        this.transactionStatus.supplierApproval = value;
    }
    setReceiversBankApproval(value){
        this.transactionStatus.receiversBankApproval = value;
    }

    /**
     * buffer convertors
     * @param {Buffer} buffer 
     */
    static fromBuffer(buffer) {
        return Cbt.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Cbt);
    }

    // Factory method to create cross border transaction object
    static createInstance(txnId, timeStamp, requesterObj, supplierObj, productObj, transporterObject, monetaryStatus, productStatus, transactionStatus){
        return new Cbt({txnId, timeStamp, requesterObj, supplierObj, productObj, transporterObject, monetaryStatus, productStatus, transactionStatus});
    }

    static getClass() {
        return 'org.worldbank.cbt';
    }
 }

 module.exports = Cbt;