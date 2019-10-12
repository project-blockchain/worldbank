/*
 *  SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const path = require('path');
const fixtures = path.resolve(__dirname, '../network');

// A wallet stores a collection of identities
class WalletSetup{
    static walletSetup(orgName, userName, secretKey) {
        // Main try/catch block
        try {
            const wallet = new FileSystemWallet('./identity/'+orgName+'/'+userName+'/'+'wallet');
            // Identity to credentials to be stored in the wallet
            const credPath = path.join(fixtures, '/crypto-config/peerOrganizations/'+orgName+'.worldbank.com/users/'+userName+'@'+orgName+'.worldbank.com');
            const cert = fs.readFileSync(path.join(credPath, '/msp/signcerts/'+userName+'@'+orgName+'.worldbank.com-cert.pem')).toString();
            const key = fs.readFileSync(path.join(credPath, '/msp/keystore/'+secretKey+'_sk')).toString();
    
            // Load credentials into wallet
            const identityLabel = userName+'@'+orgName+'.worldbank.com';
            const identity = X509WalletMixin.createIdentity(orgName+'MSP', cert, key);
    
            wallet.import(identityLabel, identity);
    
        } catch (error) {
            console.log(`Error adding to wallet. ${error}`);
            console.log(error.stack);
        }
    }
}
module.exports = WalletSetup;
