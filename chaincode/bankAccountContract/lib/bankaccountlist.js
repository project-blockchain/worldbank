/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const BankAccount = require('./bankaccount.js');

class BankAccountList extends StateList {
    constructor(ctx) {
        super(ctx, 'org.worldbank.bankaccountlist');
        this.use(BankAccount);
    }

    async addBankAccount(bankAccount) {
        return this.addState(bankAccount);
    }

    async getBankAccount(bankAccountKey){
        return this.getState(bankAccountKey);
    }

    async updateBankAccount(bankAccount) {
        return this.updateState(bankAccount);
    }
}

module.exports = BankAccountList;
