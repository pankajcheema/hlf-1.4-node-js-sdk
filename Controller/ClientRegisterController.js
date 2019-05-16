/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
//const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', 'Config', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);
let response = {};
class FabricClientRegister {
    constructor() {
        console.log("called constructer");
    }
    async  RegisterAdmin() {
        try {

            // Create a new CA client for interacting with the CA.
            const caURL = ccp.certificateAuthorities['ca.example.com'].url;
            const ca = new FabricCAServices(caURL);

            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the admin user.
            const adminExists = await wallet.exists('admin');
            if (adminExists) {
                response.data = null;
                response.httpstatus = 400;
                response.message = "An identity for the admin user 'admin' already exists in the wallet"
                return response;
            }

            // Enroll the admin user, and import the new identity into the wallet.
            const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
            const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
            wallet.import('admin', identity);
            console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
            response.data = identity;
            response.httpstatus = 200;
            response.message = "admin enrolled successfully"
            return response;


        } catch (error) {
            response.error = error;
            response.httpstatus = 500;
            response.message = "Failde to enroll admin due to above error";
            return response;
        }
    }
    async  RegisterUser() {
        try {

            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists('user1');
            if (userExists) {
                response.data = null;
                response.httpstatus = 400;
                response.message = "An identity for the  user already exists in the wallet";
                return response;
            }

            // Check to see if we've already enrolled the admin user.
            const adminExists = await wallet.exists('admin');
            if (!adminExists) {
                response.data = null;
                response.httpstatus = 400;
                response.message = "Am admin identity is not registered . please register admin first";
                return response;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } });

            // Get the CA client object from the gateway for interacting with the CA.
            const ca = gateway.getClient().getCertificateAuthority();
            const adminIdentity = gateway.getCurrentIdentity();

            // Register the user, enroll the user, and import the new identity into the wallet.
            const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: 'user1', role: 'client' }, adminIdentity);
            const enrollment = await ca.enroll({ enrollmentID: 'user1', enrollmentSecret: secret });
            const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
            wallet.import('user1', userIdentity);
            response.data = userIdentity;
            response.httpstatus = 200;
            response.message = "Successfully registered and enrolled admin user 'user1' and imported it into the wallet";
            return response;


        } catch (error) {
            response.error = error;
            response.httpstatus = 500;
            response.message = "Failde to enroll admin due to above error";
            return response;
        }
    }

}
module.exports = FabricClientRegister
