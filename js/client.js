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
		this.retryCount = 0;
	}
	
	/**
	 * @param {object} options
	 * @param {boolean} options.retry
	 */
	connect(options) {
		this.log("Connecting...");
		try {
			this.socket = new WebSocket(this.url);
			this.socket.addEventListener("open", this.open.bind(this));
			this.socket.addEventListener("close", this.close.bind(this));
			this.socket.addEventListener("error", this.error.bind(this));
			if (options.retry) {
				this.socket.addEventListener("error", this.retry.bind(this, options));
			}
		} catch(err) {
			this.log("Catch:" + err);
		}
		this.after.connect();
	}
	
	/**
	 *
	 */
	open() {
		this.log("Connection opened!");
		this.after.open();
	}
	
	/**
	 *
	 */
	close() {
		this.log("Connection closed!");
		this.after.close();
	}
	
	/**
	 *
	 */
	retry(options) {
		this.retryCount += 1;
		this.log("Retrying connection (" + this.retryCount + ")...");
		this.connect(options);
	}
	
	/**
	 *
	 */
	error(error) {
		this.log("Error: " + error);
		this.after.error();
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