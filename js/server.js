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
		this.socket.on("connection", this.onConnection);
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
		let connection = new Connection({
			server: this,
			socket: socket,
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
	 *
	 */
	constructor(server, socket) {
		
		this.server = server;
		this.socket = socket;
		
		socket.on("message", this.onMessage);
		
		server.log("new Connection: ", Connection);
		
	}
	
	/**
	 *
	 */
	onMessage(message) {
	}
	
}

//
module.exports = Server;