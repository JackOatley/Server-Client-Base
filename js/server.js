#!/usr/bin/env node

const WebSocket = require("ws");

/**
 * Create a server.
 * @param {number} options.port The server port.
 */
function Server(opts = {}) {
	this.port = opts.port || 8123;
	this.socket = null;
	this.connections = [];
	this.logRecord = [];
}
	
/**
 *
 */
Server.prototype.start = function() {
	this.log("Starting server...");
	this.socket = new WebSocket.Server({ port: this.port });
	this.log("Server started!");
	this.log("Creating event listeners...");
	this.socket.on("connection", this.onConnection.bind(this));
	this.log("Done!");
}

/**
 * @param {function} callback A callback function to be run when the server
 * successfully closes.
 */
Server.prototype.stop = function(callback) {
	this.log("Stopping server...");
	this.socket.close( () => {
		this.log("Server stopped!");
		callback();
	});
}

/**
 *
 */
Server.prototype.onConnection = function(socket, request){
	this.log("Creating new connection...");
	let connection = new Connection(this, socket, request, {
		logMessages: true
	});
	this.connections.push(connection);
}

/**
 *
 */
Server.prototype.log = function(...message) {
	var s = this;
	message.forEach(function(m) {
		s.logRecord.push(m);
		console.log(m);
	});
}

/**
 * @param {Server} server
 * @param {WebSocket} socket
 * @param {boolean} options.logMessages
 */
function Connection(server, socket, request, opts = {}) {
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
Connection.prototype.onClose = function(code, reason) {
	this.server.log("Error (" + code + ") " + reason);
}

/**
 *
 */
Connection.prototype.onMessage = function(message) {
	this.server.log("Recieved message from (" + this.ip + "): " + message);
}

//
module.exports = Server;