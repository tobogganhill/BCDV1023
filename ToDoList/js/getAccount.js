// Connect to Ganache
// RPC Server should generally be: HTTP://127.0.0.1:7545
web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

// This function will retrieve the first account [0] from Ganache
// and set it as the default account.
async function getAccount() {
	let accounts = await web3.eth.getAccounts();
	web3.eth.defaultAccount = accounts[0];
	console.log('Ganache account ' + web3.eth.defaultAccount + ' detected.');
	return web3.eth.defaultAccount;
}
