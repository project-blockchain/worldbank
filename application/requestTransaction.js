/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
const Cbt = require('../chaincode/cbtContract/lib/cbt.js');
// request transaction function
var requestTransaction = async function (orgName, userName, secretKey, channelName, contractName, param) {

    const wallet = new FileSystemWallet('./identity/'+orgName+'/'+userName+'/'+'wallet');
    const gateway = new Gateway();
    // Main try/catch block
    try {

        // Specify userName for network access
        const uName = userName+'@'+orgName+'.worldbank.com';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('./../network/gateway/cbtNetConnection.yaml', 'utf8'));
        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: uName,
            wallet: wallet,
            discovery: { enabled:false, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access network
        console.log(`Use network channel. ${channelName}`);

        const network = await gateway.getNetwork(channelName);
        if(network==null){
            console.log('network loading failed');
        }

        //get contract object
        const contract = await network.getContract(contractName);
        if(contract == null){
            console.log('contract loading failed');
        }

         // get current timestamp
         let timestamp = String(new Date().getTime());
         console.log(`current timestamp: ${timestamp}`);
 
        // convert Requestor object to String
        param[0] =  JSON.stringify(param[0]);
        console.log(param[0]);

        // convert Supplier object to String
        param[1] =  JSON.stringify(param[1]);
        console.log(param[1]);

        // convert Product object to String
        param[2] = JSON.stringify(param[2]);
        console.log(param[2]);


        // calling contract function
        console.log('Submit requestTransaction transaction.');
        const response = await contract.submitTransaction("requestTransaction", timestamp, param[0], param[1], param[2], param[3]);

        // process response
        console.log('Process requestTransaction transaction response.' + response);
        let jsonResponse = Cbt.fromBuffer(response);
        // console.log(jsonResponse);

        // return response to user
        console.log('requestTransaction Transaction complete.');
        return jsonResponse;

    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
    }finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
    }
}

module.exports = requestTransaction;

// driver Code
// let requesterObj = {"name": "shubham", "address":"addr", "bankAccount":{"bankName":"xbank", "accountNo":"1"}} ;
// let supplierObj  = {"name": "akshay", "address":"addr2", "bankAccount":{"bankName":"hdfc", "accountNo":"1"}};
// let productObj  = {"id": "65", "name": "steel material", "quantity": "40", "amount": "4000"};
// let description  = "this is desc. from requestor";
// requestTransaction("xbank", "User1", "41f362b141152ef2a07ba738d9417c8e346af9656740461073dfdce4c26c816e", "cbtchannel", "cbtcc200", [requesterObj, supplierObj, productObj, description]).then(() => {
//     console.log('requestTransaction program complete.');
//     }).catch((e) => {
//         console.log('requestTransaction program exception.');
//         console.log(e);
//         console.log(e.stack);
//         process.exit(-1);
//     });
    