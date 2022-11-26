let contractABI = [
	{
		inputs: [
			{
				internalType: 'string',
				name: '_desc',
				type: 'string',
			},
			{
				internalType: 'enum ToDo.Importance',
				name: '_imp',
				type: 'uint8',
			},
		],
		name: 'addTask',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_taskIndex',
				type: 'uint256',
			},
		],
		name: 'deleteTask',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_taskIndex',
				type: 'uint256',
			},
			{
				internalType: 'bool',
				name: '_status',
				type: 'bool',
			},
		],
		name: 'updateStatus',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_taskIndex',
				type: 'uint256',
			},
		],
		name: 'getTask',
		outputs: [
			{
				components: [
					{
						internalType: 'string',
						name: 'desc',
						type: 'string',
					},
					{
						internalType: 'enum ToDo.Importance',
						name: 'imp',
						type: 'uint8',
					},
					{
						internalType: 'bool',
						name: 'isDone',
						type: 'bool',
					},
				],
				internalType: 'struct ToDo.Task',
				name: '',
				type: 'tuple',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getTaskCount',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
];

// Used Remix to deploy ToDo.sol to Ganache, Network ID: 5777
let contractAddress = '0xD7B16a8254Db15Ad2bFF09bFCb32a9FC4549674a';
