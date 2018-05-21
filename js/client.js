#!/usr/bin/env node

const WebSocket = require("ws");
const noop = () => {};

/** Class representing a client. */
class Client {

	/**
	 * @param {object} options
	 * @param {url} options.url
	 * @param {object} options.after
	 */
	constructor(options = {}) {
		this.url = options.url || "ws://localhost:8123",
		this.socket = null;
		this.logRecord = [];
		this.after = Object.assign({}, _afterProperties, options.after || {});
		this.after.constructor();
	}
	
	/**
	 *
	 */
	connect(options) {
		this.log("Connecting...");
		this.socket = new WebSocket(this.url);
		this.socket.addEventListener("open", this.onOpen.bind(this));
		this.socket.addEventListener("error", this.onError.bind(this));
		this.after.connect();
	}
	
	/**
	 *
	 */
	onOpen() {
		this.log("Connection opened!");
		this.after.onOpen();
	}
	
	/**
	 *
	 */
	onClose() {
		this.log("Connection closed!");
		this.after.onClose();
	}
	
	/**
	 *
	 */
	onError(error) {
		this.log(error);
		this.after.onError();
	}
	
	/**
	 *
	 */
	send(data) {
		this.socket.send(data);
		this.after.send();
	}
	
	/**
	 *
	 */
	log(message) {
		this.logRecord.push(message);
		console.log(message);
		this.after.log();
	}

}

/**
 *
 */
const _afterProperties = (function() {
	let object = {};
	let names = Object.getOwnPropertyNames(Client.prototype);
	names.forEach((name) => { object[name] = noop; });
	return object;
}());

//
module.exports = Client;
export default Client;