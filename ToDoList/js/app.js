$(document).ready(createTaskList());

// auto focus on input of add task modal
$('#add-task-container').on('shown.bs.modal', function () {
	$('#new-task').trigger('focus');
});

// Set the contract object and get the number of tasks for the user.
// addTaskToList() is called to add tasks to HTML sequentially, then calls updateTaskCount().
async function createTaskList() {
	// Get account from Ganache
	try {
		await getAccount();
		// Set contract and gas
		contract = new web3.eth.Contract(contractABI, contractAddress);
		try {
			numberOfTask = await contract.methods
				.getTaskCount()
				.call({ from: web3.eth.defaultAccount });
			
			console.log('DEBUG: Number of Tasks: ' + numberOfTask);
			// If there is at least one task present...
			if (numberOfTask != 0) {
				// Fetch all tasks
				console.log('DEBUG: Fetching tasks ...');
				let taskIterator = 0;
				while (taskIterator < numberOfTask) {
					try {
						let task = await contract.methods
							.getTask(taskIterator)
							.call({ from: web3.eth.defaultAccount });
						if (task[0] != '') {
							// addTaskToList adds a task as a child of the ul tag
							addTaskToList(taskIterator, task[0], task[1]);
						} else {
							console.log('DEBUG: The index ' + taskIterator + ' is empty');
						}
					} catch {
						console.log('DEBUG: Failed to get Task ' + taskIterator);
					}
					taskIterator++;
				}
				// Update the task count in HTML
				updateTasksCount();
			}
		} catch {
			console.log('DEBUG: Failed to get task count from blockchain');
		}
	} catch {
		console.log('DEBUG: Failed to get the account');
	}
}

// addTaskToList() takes the task attributes and adds them to the HTML
function addTaskToList(id, name, status) {
	console.log('DEBUG: addTaskToList(): Add Task ' + id + ' ' + [name, status]);
	// Get the id of ul element so to be able to add children to it

	let list = document.getElementById('list');
	// Create a li element and add the class required to make look good and	set the id of it

	let item = document.createElement('li');
	item.classList.add(
		'list-group-item',
		'border-0',
		'd-flex',
		'justify-content-between',
		'align-items-center'
	);
	item.id = 'item-' + id;
	// Create a text to add it to the li element
	let task = document.createTextNode(name);
	// Create a checkbox and set its id and checked	value to add it to the li element
	var checkbox = document.createElement('INPUT');
	checkbox.setAttribute('type', 'checkbox');
	checkbox.setAttribute('id', 'item-' + id + '-checkbox');
	checkbox.checked = status;
	// if status is true then add task-done class to li element so that the linethrough displays.

	if (status) {
		item.classList.add('task-done');
	}
	// Add the li element to ul element
	list.appendChild(item);
	// Set a ondblclick event to able to remove the	item when double clicked
	item.ondblclick = function () {
		removeTask(item.id);
	};
	// Append the task description
	item.appendChild(task);
	// Append the checkbox for task
	item.appendChild(checkbox);
	// Add onclick to the checkbox
	checkbox.onclick = function () {
		changeTaskStatus(checkbox.id, id);
	};
}

// removeTask() removes the task from blockchain and then from the HTML using JQuery.
// Note: The taskIndex is the li element id {item-taskIndex}
async function removeTask(taskIndex) {
	console.log('DEBUG: removeTask(): Remove Task ' + taskIndex);
	// Create the selector for the Task
	let taskSelector = '#' + taskIndex;
	// Make taskIndex to have only task index number
	taskIndex = taskIndex.replace('item-', '');
	try {
		await contract.methods
			.deleteTask(taskIndex)
			.send({ from: web3.eth.defaultAccount });
		console.log('DEBUG: Remove Task ' + taskIndex + ' from the blockchain');
		// Remove the task from the HTML
		$(taskSelector).remove();
		// Update the task count in HTML
		updateTasksCount();
	} catch {
		console.log('DEBUG: Error occured while removing task item-' + taskIndex);
	}
}

// Change the status of task in blockchain.  Display in the HTML.
// Note: The id is the checkbox id {item-taskIndex-checkbox}
async function changeTaskStatus(id, taskIndex) {
	// Get checkbox element
	let checkbox = document.getElementById(id);
	// Get the id of the li element
	let textId = id.replace('-checkbox', '');
	// Get the li element
	let text = document.getElementById(textId);
	try {
		await contract.methods
			.updateStatus(taskIndex, checkbox.checked)
			.send({ from: web3.eth.defaultAccount });
		console.log(
			'DEBUG: changeTaskStatus(): Change status of task ' +
				textId +
				' to ' +
				checkbox.checked
		);
		if (checkbox.checked) {
			text.classList.add('task-done');
		} else {
			text.classList.remove('task-done');
		}
	} catch (error) {
		console.log(
			'DEBUG: Failed to change Status of task ' + textId + ' in blockchain'
		);
	}
}

// Update the number of tasks in HTML by counting the number of item in the ul element
function updateTasksCount() {
	// Get the element of ul tag
	let list = document.getElementById('list');
	// Get the count of the ul element
	let taskCount = list.childElementCount;
	console.log('DEBUG: updateTasksCount(): The number of tasks: ' + taskCount);
	// Set the count to the taskCount id element
	let count = document.getElementById('taskCount');
	count.innerText = taskCount + ' Tasks';
}

// Add the task to the HTML via adddTasktoList(). Then write to blockchain and update the count via updateTaskCount().
async function addTask(name) {
	// Get the form element containing the new task
	let form = document.getElementById('add-task-container');
	console.log('DEBUG: Retrieve number of tasks from Ganache.');
	// Set blank value for text in the addtask modal
	document.getElementById('new-task').value = '';
	// Remove the class because it might be present if a task was added before
	form.classList.remove('was-validated');
	// Get the number of tasks from blockchain
	contract.methods
		.getTaskCount()
		.call({ from: web3.eth.defaultAccount })
		.then(
			(numberOfTask) => {
				// Add the task to the HTML
				addTaskToList(numberOfTask, name, false);
				// Update the task count in HTML
				updateTasksCount();
			},
			(err) => {
				console.log(
					'DEBUG: Failed to get the number of tasks from blockchain ' + err
				);
			}
		);
	try {
		await contract.methods
			.addTask(name, 0)
			.send({ from: web3.eth.defaultAccount });
		console.log('DEBUG: Add task ' + name + ' to blockchain.');
	} catch {
		console.log('DEBUG: Failed to add task.');
	}
}
