#!/usr/bin/env node

const WebSocket = require("ws");

/** Class representing our server. */
class Server {

	/**
	 * Create a server.
	 * @param {number} options.port The server port.
	 */
	constructor(options = {}) {
		this.port = options.port || 8123;
		this.socket = null;
		this.connections = [];
		this.logRecord = [];
	}
	
	/**
	 *
	 */
	start() {
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
	stop(callback) {
		this.log("Stopping server...");
		this.socket.close( () => {
			this.log("Server stopped!");
			callback();
		});
	}
	
	/**
	 *
	 */
	onConnection(socket){
		this.log("Creating new connection...");
		let connection = new Connection(this, socket, {
			logMessages: true
		});
		this.connections.push(connection);
	}
	
	/**
	 *
	 */
	log(...message) {
		var s = this;
		message.forEach(function(m) {
			s.logRecord.push(m);
			console.log(m);
		});
	}

}

/** Class representing a connection. */
class Connection {
	
	/**
	 * @param {Server} server
	 * @param {WebSocket} socket
	 * @param {boolean} options.logMessages
	 */
	constructor(server, socket, options = {}) {
		this.server = server;
		this.socket = socket;
		this.logMessages = options.logMessages || false;
		this.socket.on("message", this.onMessage);
		this.server.log("Connection created!");
	}
	
	/**
	 *
	 */
	onMessage(message) {
	}
	
}

//
module.exports = Server;