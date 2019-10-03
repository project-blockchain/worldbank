/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate cross border transaction state values
const cbtState = {
    CREATED: 1,
    INPROCESS: 2,
    COMPLETED: 3,
    FAILED: 4
};

// enumerate for product state
const productState = {
    NOTREADY: 1,
    SUPPLIED: 2,
    TRANSPORTED: 3,
    RECEIVED: 4
};

// enumerate for money state
const monetaryState = {
    SUPPLIER: 1,
    SENDERBANK: 2,
    RECEIVERBANK: 3,
    RECEIVER: 4
};

/**
 * CommercialPaper class extends State class
 * Class will be used by application and smart contract to define a crocc border transaction object
 */

 class Cbt extends State {
     constructor(obj) {
         super(Cbt.getClass(), [obj.requestorObj, obj.txnId]);
         Object.assign(this, obj);
     }

    //  getters and setters

     

    // methods to encapsulate CBT state


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
    static createInstance(txnId, requestorObj, supplierObj, productId, quantity, amount, TransporterObject){
        return new Cbt({txnId, requestorObj, supplierObj, productId, quantity, amount, TransporterObject});
    }
    static getClass() {
        return 'org.worldbank.cbt';
    }
 }

 module.exports = Cbt;