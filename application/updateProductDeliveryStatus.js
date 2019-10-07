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

async function updateProductDeliveryStatus(orgName, userName, secretKey, channelName, contractName, param) {

    const wallet = new FileSystemWallet('./identity/'+orgName+'/'+userName+'/'+'wallet');
    const gateway = new Gateway();
    // Main try/catch block
    try {

        // Specify userName for network access
        const uName = userName+'@'+orgName+'.worldbank.com';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../network/gateway/cbtNetConnection.yaml', 'utf8'));
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
 
        // calling contract function
        console.log('Submit getCbt transaction.');
        const response = await contract.submitTransaction("updateProductDeliveryStatus", param[0], param[1], param[2], param[3]);

        // process response
        console.log('Process issue transaction response.' + response);
        let jsonResponse = Cbt.fromBuffer(response);
        console.log(jsonResponse);

        // return response to user
        console.log('get CBT Transaction complete.');
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

// driver Code

let name = "rohit";
let txnId = "112345";
let status = "4";
let description = "desc. from receiver";

updateProductDeliveryStatus("xbank", "User1", "82592ffb23cc9207d8023a51374c1f75e803fefd96d23faf301b18c62c9da779", "cbtchannel", "cbt14", [name, txnId, status, description]).then(() => {
    console.log('updateProductDeliveryStatus program complete.');
    }).catch((e) => {
        console.log('updateProductDeliveryStatus program exception.');
        console.log(e);
        console.log(e.stack);
        process.exit(-1);
    });
    