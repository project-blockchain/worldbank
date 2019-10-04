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
// A wallet stores a collection of identities for use
//const wallet = new FileSystemWallet('../user/isabella/wallet');

// Main program function
class Connection{

    connection(orgName, userName, channelName, contractName) {

        //access to wallet for credentials
        const wallet = new FileSystemWallet('./identity/'+orgName+'/'+userName+'/'+'wallet');
    
    
        // A gateway defines the peers used to access Fabric networks
        const gateway = new Gateway();
    
        // Main try/catch block
        try {
    
            // Specify userName for network access
            // const userName = 'isabella.issuer@magnetocorp.com';
            const uName = userName+'@'+orgName+'.worldbank.com';
    
            // Load connection profile; will be used to locate a gateway
            let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/networkConnection.yaml', 'utf8'));
    
            // Set connection options; identity and wallet
            let connectionOptions = {
                identity: uName,
                wallet: wallet,
                discovery: { enabled:false, asLocalhost: true }
            };
    
            // Connect to gateway using application specified parameters
            console.log('Connect to Fabric gateway.');
    
            await gateway.connect(connectionProfile, connectionOptions);
    
            // Access PaperNet network
            console.log('Use network channel: mychannel.');
    
            const network = await gateway.getNetwork(channelName);
    
            // Get addressability to commercial paper contract
            console.log('Use org.papernet.commercialpaper smart contract.');
    
            const contract = await network.getContract(contractName);
    
            return contract;
    
        } catch (error) {
    
            console.log(`Error in connection. ${error}`);
            console.log(error.stack);
    
        } finally {
    
            // Disconnect from the gateway
            console.log('Disconnect from Fabric gateway.');
            gateway.disconnect();
    
        }
    
    }
}

module.exports = Connection;