const path = require('path');           // For work with filesystem
const fs = require('fs');               // For work with disk files
const solc = require('solc'); 
const chalk = require('chalk');          

// Find the file
const contractPath = path.resolve(__dirname, "../contracts", "UsersContract.sol");

// Read their font-code
const source = fs.readFileSync(contractPath, 'utf-8');

// console.log(source);
const {interface, bytecode} = solc.compile(source, 1).contracts[':UsersContract'];

//console.log(solc.compile(source, 1));
console.log(chalk.green(bytecode));
console.log(chalk.cyan(interface));

/*var input = {
    language: 'Solidity',
    sources: {
      'UsersContract.sol': {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': [ '*' ]
        }
      }
    }
  };

var output = JSON.parse(solc.compile(JSON.stringify(input)));*/

// exports.bytecode = output.contracts['UsersContract.sol']['UsersContract'].evm.bytecode.object;