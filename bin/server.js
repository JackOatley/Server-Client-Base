#!/usr/bin/env node
"use strict";

var WebSocket = require("ws");

/**
 * Create a server.
 * @param {number} options.port The server port.
 */
function Server() {
	var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	this.port = opts.port || 8123;
	this.socket = null;
	this.connections = [];
	this.logRecord = [];
}

/**
 *
 */
Server.prototype.start = function () {
	this.log("Starting server...");
	this.socket = new WebSocket.Server({ port: this.port });
	this.log("Server started!");
	this.log("Creating event listeners...");
	this.socket.on("connection", this.onConnection.bind(this));
	this.log("Done!");
};

/**
 * @param {function} callback A callback function to be run when the server
 * successfully closes.
 */
Server.prototype.stop = function (callback) {
	var _this = this;

	this.log("Stopping server...");
	this.socket.close(function () {
		_this.log("Server stopped!");
		callback();
	});
};

/**
 *
 */
Server.prototype.onConnection = function (socket, request) {
	this.log("Creating new connection...");
	var connection = new Connection(this, socket, request, {
		logMessages: true
	});
	this.connections.push(connection);
};

/**
 *
 */
Server.prototype.log = function () {
	var s = this;

	for (var _len = arguments.length, message = Array(_len), _key = 0; _key < _len; _key++) {
		message[_key] = arguments[_key];
	}

	message.forEach(function (m) {
		s.logRecord.push(m);
		console.log(m);
	});
};

/**
 * @param {Server} server
 * @param {WebSocket} socket
 * @param {boolean} options.logMessages
 */
function Connection(server, socket, request) {
	var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

	this.server = server;
	this.socket = socket;
	this.logMessages = opts.logMessages || false;
	this.ip = request.connection.remoteAddress;
	this.socket.on("close", this.onClose.bind(this));
	this.socket.on("message", this.onMessage.bind(this));
	this.server.log("IP: " + this.ip);
	this.server.log("Connection created!");
}

/**
 *
 */
Connection.prototype.onClose = function (code, reason) {
	this.server.log("Error (" + code + ") " + reason);
};

/**
 *
 */
Connection.prototype.onMessage = function (message) {
	this.server.log("Recieved message from (" + this.ip + "): " + message);
};

//
module.exports = Server;
