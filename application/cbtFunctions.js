/*
SPDX-License-Identifier: Apache-2.0
*/

/*
 * This application has 6 basic steps:
 * 1. Select an identity from a wallet
 * 2. Connect to network gateway
 * 3. Access PaperNet network
 * 4. Construct request to issue commercial paper
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
const Cbt = require('../chaincode/cbtContract/lib/cbt.js');
const Connection = require('./connection.js');


// Main program function
async function requestTransaction(orgName, userName, secretKey, channelName, contractName) {

    // Main try/catch block
    try {

        //get contract object
        const contract = Connection.connection(orgName, userName, channelName, contractName);
        
        // sample for calling contract function
        console.log('Submit commercial paper issue transaction.');
        const issueResponse = await contract.submitTransaction('issue', 'MagnetoCorp', '00001', '2020-05-31', '2020-11-30', '5000000');

        // process response
        console.log('Process issue transaction response.'+issueResponse);
        let cbt = Cbt.fromBuffer(issueResponse);

        // return response to user
        console.log(`${cbt.issuer} commercial paper : ${cbt.paperNumber} successfully issued for value ${paper.faceValue}`);
        console.log('Transaction complete.');

    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
    }
}


