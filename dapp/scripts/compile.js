const path = require('path');           // For working with filesystem
const fs = require('fs');               // For working with disk files
const solc = require('solc'); 
const chalk = require('chalk');          

// Find the file
const contractPath = path.resolve(__dirname, "../contracts", "UsersContract.sol");

// Read their font-code
const source = fs.readFileSync(contractPath, 'utf-8');

module.exports = solc.compile(source, 1).contracts[':UsersContract'];
// Bytecode => Código compilado traducido por la EVM
// ABI (Application Binary Interface) => Define un contrato y sus funciones, da forma guardandolo en un fichero JSON.
// se utilizará en librerias como Web3 para inicializar instancias del contrato y ejecutar transacciones contra él

// console.log(chalk.green(bytecode));
// console.log(chalk.cyan(interface));