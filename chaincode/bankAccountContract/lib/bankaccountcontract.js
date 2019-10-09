/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// worldbank specific classes
const BankAccount = require('./bankaccount.js');
const BankAccountList = require('./bankaccountlist.js');

/**
 * custom context to get easy access for all bank accounts
 */
class BankAccountContext extends Context {
    constructor() {
        super();
        // All bank accounts are held in a list of bank accounts
        this.bankAccountList = new BankAccountList(this);
    }
}

class BankAccountContract extends Contract {
    constructor() {
        // unique name when multiple contracts per chaincode file
        super('org.worldbank.bankaccount');
    }

    /**
     * Define custom context for bank account
     */
    createContext() {
        return new BankAccountContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the bank account contract');
    }

   /**
    * create new bank account for user
    * @param {Context} ctx 
    * @param {String} bankName 
    * @param {String} accountNo 
    * @param {String} name 
    * @param {String} balance 
    */
    async createAccount(ctx, bankName, accountNo, name, balance) {
        // create an instance of BankAccount
        let bankAccount = BankAccount.createInstance(bankName, accountNo, name, balance);

        // activate account
        bankAccount.activateAccount();

        // Add the account to the list of all similar bank accounts in ledger world state
        await ctx.bankAccountList.addBankAccount(bankAccount);
    
        // returns a serialized bank account to caller of smart contract
        return bankAccount;
    }

    /**
     * transfer fund between 2 accounts from same bank
     * @param {Context} ctx 
     * @param {String} senderBankName 
     * @param {String} senderAccountNo 
     * @param {String} receiverBankName 
     * @param {String} receiverAccountNo 
     * @param {String} amount 
     */
    async interBankFundTransfer(ctx, senderBankName, senderAccountNo, receiverBankName, receiverAccountNo, amount) {
        // ToDo: validate wheather bank have permission to transfer amount from senders account

        // retrieve senders accounts by key fields provided
        let senderBankAccountKey = BankAccount.makeKey([senderBankName, senderAccountNo]);
        let senderBankAccount = await ctx.bankAccountList.getBankAccount(senderBankAccountKey);

        // retrieve receivers account by key fields provided
        let receiverBankAccountKey = BankAccount.makeKey([receiverBankName, receiverAccountNo]);
        let receiverBankAccount = await ctx.bankAccountList.getBankAccount(receiverBankAccountKey);

        console.log(`senders balance: ${senderBankAccount.getBalance()} typeof ${senderBankAccount.getBalance()}`)
        // check for senders sufficient balance
        if(Number(senderBankAccount.getBalance()) < Number(amount)) {
            return JSON.stringify({"response": "sender do not have sufficient balance to transfer"});
        }

        // transfer amount from sender to receiver
        let newSenderBalance = String(Number(senderBankAccount.getBalance()) - Number(amount));
        console.log(`new sender bal: ${newSenderBalance}`);
        senderBankAccount.setBalance(newSenderBalance);

        let newReceiverBalance = String(Number(receiverBankAccount.getBalance()) + Number(amount));
        console.log(`new receiever bal: ${newReceiverBalance}  type: ${typeof newReceiverBalance}`);
        receiverBankAccount.setBalance(newReceiverBalance);
        
        // update both the accounts into world state
        await ctx.bankAccountList.updateBankAccount(senderBankAccount);
        await ctx.bankAccountList.updateBankAccount(receiverBankAccount);

        // return senders bank account
        return senderBankAccount;       
    }
    
    /**
     * transfer fund between 2 accounts from different bank
     * @param {Context} ctx 
     * @param {String} senderBankName 
     * @param {String} senderAccountNo 
     * @param {String} receiverBankName 
     * @param {String} receiverAccountNo 
     * @param {String} amount 
     */
    async otherBankFundTransfer(ctx, senderBankName, senderAccountNo, receiverBankName, receiverAccountNo, amount) {
        // ToDo: validate wheather bank have permission to transfer amount from senders account

        // retrieve senders accounts by key fields provided
        let senderBankAccountKey = BankAccount.makeKey([senderBankName, senderAccountNo]);
        let senderBankAccount = await ctx.bankAccountList.getBankAccount(senderBankAccountKey);

        // retrieve receivers account by key fields provided
        let receiverBankAccountKey = BankAccount.makeKey([receiverBankName, receiverAccountNo]);
        let receiverBankAccount = await ctx.bankAccountList.getBankAccount(receiverBankAccountKey);

        // check for senders sufficient balance
        if(senderBankAccount.getBalance() < amount) {
            return JSON.stringify({"response": "sender do not have sufficient balance to transfer"});            
        }

        // transfer amount from sender to receiver
        let newSenderBalance = String(Number(senderBankAccount.getBalance()) - Number(amount));
        senderBankAccount.setBalance(newSenderBalance);
        let newReceiverBalance = String(Number(receiverBankAccount.getBalance()) + Number(amount));
        receiverBankAccount.setBalance(newReceiverBalance);
        
        // update both the accounts into world state
        await ctx.bankAccountList.updateBankAccount(senderBankAccount);
        await ctx.bankAccountList.updateBankAccount(receiverBankAccount);

        // return senders bank account
        return senderBankAccount;       
    }

    /**
     * view bank account balance
     * @param {Context} ctx 
     * @param {String} bankName 
     * @param {String} bankAccountNo 
     */
    async viewAccount(ctx, bankName, bankAccountNo) {
        // ToDo: validate wheather bank have permission to transfer amount from senders account

        // retrieve the current bank account using key fields provided
        let bankAccountKey = BankAccount.makeKey([bankName, bankAccountNo]);
        let bankAccount = await ctx.bankAccountList.getBankAccount(bankAccountKey);

        // return serialized balace of account object
        return bankAccount;

    }
}

module.exports = BankAccountContract;