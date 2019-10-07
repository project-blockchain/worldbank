/*
SPDX-License-Identifier: Apache-2.0
updateed: 08-10-2019 3:18

*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const Cbt = require('./cbt.js');

class CbtList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.worldbank.cbtlist');
        this.use(Cbt);
    }

    async addTransaction(cbtObj) {
        return this.addState(cbtObj);
    }

    async getTransaction(cbtObjKey) {
        return this.getState(cbtObjKey);
    }

    async updateTransaction(cbtObj) {
        return this.updateState(cbtObj);
    }
}

module.exports = CbtList;