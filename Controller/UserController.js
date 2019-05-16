/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', 'Config', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);
let response = {};
class UserController {
    constructor() {
        console.log("constructer called")
    }
    async  RegisterUser() {
        try {

            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists('user1');
            if (!userExists) {
                response.data = null;
                response.httpstatus = 400;
                response.message = "Register an identity first";
                return response;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('user');

            // Submit the specified transaction.
            // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
            // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
            var data = { "first_name": "pankaj", "last_name": "cheema", "roll": 23 }
            await contract.submitTransaction('addUser', '123456', JSON.stringify(data));
            console.log('Transaction has been submitted');
            // Disconnect from the gateway.
            await gateway.disconnect();
            response.data = data;
            response.httpstatus = 200;
            response.message = "Transaction has been submitted";
            return response;
        } catch (error) {
            response.error = error;
            response.httpstatus = 500;
            response.message = "something went wrong";
            return response;
        }
    }
    async  GetUser() {
        try {

            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists('user1');
            if (!userExists) {
                response.data = null;
                response.httpstatus = 400;
                response.message = "Register an identity first";
                return response;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('user');

            // Evaluate the specified transaction.
            // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
            // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
            const result = await contract.evaluateTransaction('getUser', '1234');
            response.data = result.toString();
            response.httpstatus = 200;
            response.message = "Transaction has been evaluated";
            return response;


        } catch (error) {
            response.error = error;
            response.httpstatus = 500;
            response.message = "something went wrong";
            return response;
        }
    }
}
module.exports = UserController;

