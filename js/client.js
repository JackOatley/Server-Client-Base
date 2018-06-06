//#!/usr/bin/env node

const isNodeJs = typeof module !== "undefined";
const WebSocket = isNodeJs ? require("ws") : WebSocket;
const noop = () => {};

/**
 * @param {object} options
 * @param {url} options.url
 * @param {object} options.after
 */

function Client(opts = {}) {
	this.url = opts.url || "ws://localhost:8123",
	this.socket = null;
	this.logRecord = [];
	this.after = Object.assign({}, _afterProperties, opts.after || {});
	this.after.constructor();
	this.retryCount = 0;
}
	
/**
 * @param {object} options
 * @param {boolean} options.retry
 */
Client.prototype.connect = function(options) {
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
Client.prototype.open = function() {
	this.log("Connection opened!");
	this.after.open();
}

/**
 *
 */
Client.prototype.close = function() {
	this.log("Connection closed!");
	this.after.close();
}

/**
 *
 */
Client.prototype.retry = function(options) {
	this.retryCount += 1;
	this.log("Retrying connection (" + this.retryCount + ")...");
	this.connect(options);
}

/**
 *
 */
Client.prototype.error = function(error) {
	this.log("Error: " + error);
	this.after.error();
}

/**
 *
 */
Client.prototype.send = function(data) {
	this.socket.send(data);
	this.after.send();
}

/**
 *
 */
Client.prototype.log = function(message) {
	this.logRecord.push(message);
	console.log(message);
	this.after.log();
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
if (isNodeJs)
	module.exports = Client;
else
	Window.Client = Client;