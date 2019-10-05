# must needed for every time
# we need to tell the configtxgen tool where to look for the configtx.yaml file that it needs to ingest. We will tell it look in our present working directory:
export FABRIC_CFG_PATH=$PWD


# for first initializatioon
# generate network artifacts
../bin/cryptogen generate --config=./crypto-config.yaml

# create orderer genesis block
../bin/configtxgen -profile OrdererGenesis -channelID worldbank-sys-channel -outputBlock ./channel-artifacts/genesis.block

# export channel name variable
export CHANNEL_NAME=<your channel name>

# create channel configuration transaction
../bin/configtxgen -profile MultiOrgsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME 

# define anchor peer for every Organization
../bin/configtxgen -profile MultiOrgsChannel -channelID $CHANNEL_NAME -outputAnchorPeersUpdate ./channel-artifacts/xbankMSPanchors.tx -asOrg xbankMSP

# let’s start our network:
docker-compose -f docker-compose-cli.yaml up

# enter into the CLI container using the docker exec command:
docker exec -it cli bash

# default working dir.
/opt/gopath/src/github.com/hyperledger/fabric/peer

# create channel 
peer channel create -o orderer.worldbank.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/worldbank.com/orderers/orderer.worldbank.com/msp/tlscacerts/tlsca.worldbank.com-cert.pem

# join channel
peer channel join -b <channel_name>.block


# Update the channel definition to define the anchor peer for Organizations in network
peer channel update -o orderer.worldbank.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/Org1MSPanchors.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/worldbank.com/orderers/orderer.worldbank.com/msp/tlscacerts/tlsca.worldbank.com-cert.pem


#  package the chaincode before installing [ for node js chaincode ]
# 1. for lifecycle V2 alpha
peer lifecycle chaincode package mycc.tar.gz --path /opt/gopath/src/github.com/hyperledger/fabric-samples/chaincode/abstore/node/ --lang node --label mycc_1
#2. for V1.4
peer chaincode install -n cbtcc -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/

# instantiate chaincode 
peer chaincode instantiate -o orderer.worldbank.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/worldbank.com/orderers/orderer.worldbank.com/msp/tlscacerts/tlsca.worldbank.com-cert.pem -C $CHANNEL_NAME -n cbtcc11 -v 1.0 -c '{"Args":["init","a", "100", "b","200"]}' -P "OR ('xbankMSP.peer','hdfcMSP.peer')"

# query chaincode
peer chaincode query -C $CHANNEL_NAME -n mycc -c '{"Args":["query","a"]}'

# invoke chaincode
#1
peer chaincode invoke -o orderer.worldbank.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/worldbank.com/orderers/orderer.worldbank.com/msp/tlscacerts/tlsca.worldbank.com-cert.pem -C $CHANNEL_NAME -n cbtcc16 -c '{"Args": }'
#2
peer chaincode invoke -o orderer.worldbank.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/worldbank.com/orderers/orderer.worldbank.com/msp/tlscacerts/tlsca.worldbank.com-cert.pem -C $CHANNEL_NAME -n cbtcc9 --peerAddresses peer0.xbank.worldbank.com:9001 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/xbank.worldbank.com/peers/peer0.xbank.worldbank.com/tls/ca.crt --peerAddresses peer0.hdfc.worldbank.com:9011 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/hdfc.worldbank.com/peers/peer0.hdfc.worldbank.com/tls/ca.crt -c '{"Args": }'
