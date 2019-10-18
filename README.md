# worldbank
We took one scenario to simulate cross border transaction, where L&T located in Atlanta, US wants to request for a stock of steel products to Tata Steel located in Kolkata, India. As this deal involves so many asset transfer (money and product) and their provenance between the countries, they need to rely on banks to handle all the financial and legal transactions. In this solution, we tried to create a blockchain based system to handle such tran sactions and records for the same in a common distributed ledger.


| document | https://drive.google.com/file/d/1KeBR-GyABiS002eLNUutAWJHBhb_GOo7/view?usp=sharing |
| -------- | ---------------------------------------------------------------------------------- | 

| video | https://www.youtube.com/watch?v=rWWAaTIxSYo |
| ----- | ------------------------------------------- |

 
 
 ### steps to start network
 1. navigate to metwork directory   
 ``` cd network```
 
 2. up the network   
 ``` docker-compose -f docker-compose-cli.yaml up ```


### steps to install & invoke chaincode

3. define CHANNEL_NAME   
```export CHANNEL_NAME=<CHANNEL_NAME>```

4. create channel   
<!-- with TLS -->
```
peer channel create -o orderer.worldbank.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/worldbank.com/orderers/orderer.worldbank.com/msp/tlscacerts/tlsca.worldbank.com-cert.pem
```
<!-- without TLS -->
```
peer channel create -o orderer.worldbank.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx
```

5. join channel   
```
peer channel join -b <CHANNEL_NAME>.block
```


6. Update the channel definition to define the anchor peer for Organizations in network   
<!-- with TLS -->
```
peer channel update -o orderer.worldbank.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/Org1MSPanchors.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/worldbank.com/orderers/orderer.worldbank.com/msp/tlscacerts/tlsca.worldbank.com-cert.pem
```
<!-- without TLS -->
```
peer channel update -o orderer.worldbank.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/Org1MSPanchors.tx
```


7. package the chaincode before installing (for node js chaincode)   
<!-- 1. for lifecycle V2 alpha -->
```
peer lifecycle chaincode package mycc.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric-samples/chaincode/abstore/node/ --lang node --label mycc_1
```
<!-- 2. for V1.4 -->
<!-- for CBT -->
```
peer chaincode install -n cbtcc300 -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/cbtContract/
```
<!-- for bank system -->
```
peer chaincode install -n bacc300 -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/bankAccountContract
```

8. export channel name   
```
export CHANNEL_NAME=<CHANNEL_NAME>
```

9. instantiate chaincode    
<!-- with TLS and Policies-->
```
peer chaincode instantiate -o orderer.worldbank.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/worldbank.com/orderers/orderer.worldbank.com/msp/tlscacerts/tlsca.worldbank.com-cert.pem -C $CHANNEL_NAME -n cbtcc -v 1.0 -c '{"Args": }' -P "OR ('xbankMSP.peer','hdfcMSP.peer')"
```
<!-- with TLS and wihtout Policies -->
```
peer chaincode instantiate -o orderer.worldbank.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/worldbank.com/orderers/orderer.worldbank.com/msp/tlscacerts/tlsca.worldbank.com-cert.pem -C $CHANNEL_NAME -n cbtcc -v 1.0 -c '{"Args": ["org.worldbank.cbt:instantiate"]}'
```
<!-- withoutu TLS and without Policies -->
<!-- for CBT -->
```
peer chaincode instantiate -o orderer.worldbank.com:7050 -C $CHANNEL_NAME -n cbtcc300 -v 1.0 -c '{"Args": ["org.worldbank.cbt:instantiate"]}'
```
<!-- for bank system -->
```
peer chaincode instantiate -o orderer.worldbank.com:7050 -C $CHANNEL_NAME -n bacc300 -v 1.0 -c '{"Args": ["org.worldbank.bankaccount:instantiate"]}'
```

10. query chaincode   
```
peer chaincode query -C $CHANNEL_NAME -n <chaincode_name> -c '{"Args":["query","a"]}'
```

11. invoke chaincode   
<!-- with TLS -->
```
peer chaincode invoke -o orderer.worldbank.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/worldbank.com/orderers/orderer.worldbank.com/msp/tlscacerts/tlsca.worldbank.com-cert.pem -C $CHANNEL_NAME -n cbtcc14 -c '{"Args": }'
```
<!-- without TLS -->
<!-- for CBT -->
```
peer chaincode invoke -o orderer.worldbank.com:7050 -C $CHANNEL_NAME -n cbtcc300 -c '{"Args": }'
```
<!-- for bank -->
```
peer chaincode invoke -o orderer.worldbank.com:7050  -C $CHANNEL_NAME -n bacc200 -c '{"Args": }'
```
