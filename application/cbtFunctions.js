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

const Cbt = require('../chaincode/cbtContract/lib/cbt.js');
const Connection = require('./connection.js');
const yaml = require('js-yaml');

// Main program function
async function requestTransaction(orgName, userName, secretKey, channelName, contractName, fun_inputList) {

    // Main try/catch block
    try {

        //get contract object
        const contract = Connection.connection(orgName, userName, channelName, contractName);
        
        // sample for calling contract function
        console.log('Submit CBT getCbt transaction.');
        const issueResponse = await contract.submitTransaction(fun_inputList);

        // process response
        console.log('Process issue transaction response.'+issueResponse);
        //let cbt = Cbt.fromBuffer(issueResponse);

        // return response to user
        //console.log(`${cbt.issuer} commercial paper : ${cbt.paperNumber} successfully issued for value ${paper.faceValue}`);
        console.log('Transaction complete.');

    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    }
}

requestTransaction("xbank", "User1", "63b280ba700882d0cc4988a22013c9ead583f741accda16a167d24e2b9c490cd", "cbtchannel", "cbt", ['getCbt', 'shubham', '112345']).then(() => {

    console.log('requestTransaction program complete.');

}).catch((e) => {

    console.log('requestTransaction program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});


