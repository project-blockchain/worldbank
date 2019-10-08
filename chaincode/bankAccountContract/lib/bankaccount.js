/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const State = require('./../ledger-api/state.js');

// Enumerate bank account state values
const baState = {
    ACTIVE: 1,
    INACTIVE: 2
};

/**
 * BankAccount class extends State
 * class will be be used by application and smar tcontract to define bank accounts
 */
class BankAccount extends State {
    constructor(obj) {
        super(BankAccount.getClass(), [obj.bankName, obj.accountNo]);
        Object.assign(this, obj);
    }

    getBalance() {
        return this.balance;
    }

    setBalance(newBalance) {
        this.balance = newBalance;
    }

    activateAccount(){
        this.currentState = baState.ACTIVE;
    }

    deactivateAccount() {
        this.currentState = baState.INACTIVE;
    }
    
    static fromBuffer(buffer) {
        return BankAccount.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, BankAccount);
    }

    /**
     * @param {String} bankName
     * @param {String} accountNo 
     * @param {String} name 
     * @param {String} balance 
     */
    static createInstance(bankName, accountNo, name, balance) {
        return new BankAccount({bankName, accountNo, name, balance})
    }

    /**
     * factory method for account object 
     */
    static getClass() {
        return 'org.worldbank.bankaccount';
    }
}

module.exports = BankAccount;