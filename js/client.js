#!/usr/bin/env node

const WebSocket = require("ws");

/** Class representing a client. */
class Client {

	/**
	 *
	 */
	constructor(options = {}) {
		this.url = options.url || "ws://localhost:8123",
		this.socket = null;
		this.logRecord = [];
	}
	
	/**
	 *
	 */
	connect() {
		this.log("Connecting...");
		this.socket = new WebSocket(this.url);
		this.socket.addEventListener("open", this.onOpen.bind(this));
		this.socket.addEventListener("error", this.onError.bind(this));
	}
	
	/**
	 *
	 */
	onOpen() {
		this.log("Connection opened!");
	}
	
	/**
	 *
	 */
	onError(error) {
		this.log(error);
	}
	
	/**
	 *
	 */
	log(message) {
		this.logRecord.push(message);
		console.log(message);
	}

}

//
module.exports = Client;
export default Client;