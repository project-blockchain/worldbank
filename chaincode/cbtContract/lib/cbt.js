/*
SPDX-License-Identifier: Apache-2.0
updateed: 08-10-2019 3:18
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate cross border transaction state values
const cbtState = {
    REQUESTED: 1,
    INPROCESS: 2,
    PENDING: 3,
    SUCCESSFUL: 4,
    FAILED: 5
};

// enumerate for product state
const productState = {
    NOTREADY: 1,
    SUPPLIED: 2,
    TRANSPORTED: 3,
    DELIVERED: 4,
    FAILED: 5
};

/**
 * Cbt class extends State class
 * Class will be used by application and smart contract to define a cross border transaction object
 */

class Cbt extends State {
    constructor(obj) {
        super(Cbt.getClass(), [obj.requesterObj.name, obj.cbtId]);
        Object.assign(this, obj);
    }

    //  getters and setters
    // 1. requesoter

    // 2. supplier

    // 3. transporter

    /**
     * 
     * @param {Strgng} id 
     * @param {String} name 
     * @param {String} address 
     * @param {String} charges 
     */
    setTransporterObject(id, name, address, charges) {
        this.transporterObj.id = id;
        this.transporterObj.name = name;
        this.transporterObj.address = address;
        this.transporterObj.charges = charges
    }

    // 4. monetaryStatus
    getmonetaryStatus() {
        return this.monetaryStatus;
    }
    
    /**
     * 
     * @param {String} to 
     * @param {String} from 
     * @param {String} amount 
     */
    setMonetaryStatus(to, from, amount) {
        this.monetaryStatus.to = to;
        this.monetaryStatus.from = from;
        this.monetaryStatus.amount = amount;    
    }

    // 5. product status
    getProductState() {
        return this.productStatus.state;
    }
    getProductHolder() {
        return this.productStatus.holder;
    }
    getProductLocation() {
        return this.productStatus.location;
    }

    /**
     * 
     * @param {String} state 
     */
    setProductState(state) {
        this.productStatus.state = state;
    }

    /**
     * 
     * @param {String} holder 
     */
    setProductHolder(holder) {
        this.productStatus.holder = holder;
    }

    /**
     * 
     * @param {String} location 
     */
    setProductLocation(location) {
        this.productStatus.location = location;
    }

    /**
     * 
     * @param {String} state 
     * @param {String} holder 
     * @param {String} location 
     */
    setProductStatus(state, holder, location) {
        this.setProductState(state);
        this.setProductHolder(holder);
        this.setProductLocation(location);
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

    /**
     * 
     * @param {String} state 
     */
    setTransactionState(state) {
        this.transactionStatus.transactionState = state;
    }

    /**
     * 
     * @param {String} description 
     */
    setTransactionDescription(description) {
        this.transactionStatus.description = description;
    }
    /**
     * 
     * @param {String} value 
     */
    setSupplierApproval(value){
        this.transactionStatus.supplierApproval = value;
    }
    /**
     * 
     * @param {String} value 
     */
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
    /**
     * 
     * @param {String} cbtId 
     * @param {String} timeStamp 
     * @param {String} requesterObj 
     * @param {String} supplierObj 
     * @param {String} productObj 
     * @param {String} transporterObj 
     * @param {String} monetaryStatus 
     * @param {String} productStatus 
     * @param {String} transactionStatus 
     */
    static createInstance(cbtId, timeStamp, requesterObj, supplierObj, productObj, transporterObj, monetaryStatus, productStatus, transactionStatus){
        return new Cbt({cbtId, timeStamp, requesterObj, supplierObj, productObj, transporterObj, monetaryStatus, productStatus, transactionStatus});
    }

    static getClass() {
        return 'org.worldbank.cbt';
    }
 }

 module.exports = Cbt;