// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ToDo {
    // Important/Urgent
    // Important/Not Urgent
    // Not Important/Urgent
    // Not Important/ Not Urgent
    enum Importance {LOW, MEDIUM, HIGH, CRITICAL}

    struct Task {
        string desc;
        Importance imp;
        bool isDone;
    }

    mapping(address => Task[]) private Users;

    function addTask(string calldata _desc, Importance _imp) external {
        Users[msg.sender].push(Task({desc: _desc, imp: _imp, isDone: false}));
    }

    // Note: external functions are meant to be called by other contracts and cannot be used for internal calls.
    // Public and external functions differ in terms of gas usage.
    // Public functions use more gas than external functions when used with large arrays of data. Why?
    // Solidity copies arguments to memory for a public function, while external functions read from calldata
    // which in terms of gas is cheaper than memory allocation.
    // Calldata is a non-modifiable, non-persistent area where function arguments are stored. It behaves essentially like memory.

    function getTask(uint256 _taskIndex) external view returns (Task memory) {
        Task storage task = Users[msg.sender][_taskIndex];
        return task;
    }

    function updateStatus(uint256 _taskIndex, bool _status) external {
        Users[msg.sender][_taskIndex].isDone = _status;
    }

    function deleteTask(uint256 _taskIndex) external {
        delete Users[msg.sender][_taskIndex];
    }

    function getTaskCount() external view returns (uint256) {
        return Users[msg.sender].length;
    }
}
