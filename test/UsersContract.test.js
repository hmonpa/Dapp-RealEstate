const assert = require('assert');           // Los valores que se recuperan del SM coinciden con los que le proveemos
const Web3 = require('web3');

const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");      // @ Local server (Ganache => Red local Ethereum)
const web3 = new Web3(provider);                                                // Instancia para comunicar con Ganache

const { interface, bytecode } = require('../scripts/compile');

let accounts;
let usersContract;

beforeEach(async() => {         // Ejecuta el código antes de ejecutar cada test del archivo
    accounts = await web3.eth.getAccounts();
    usersContract = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000' });
});

// Bug pending to solve
// describe('The UsersContract', async() => {
//     it ('should deploy', () => {
//         console.log(usersContract.options.address);
//         assert.ok(usersContract.options.address);
//     });
// })