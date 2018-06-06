"use strict";

var isNodeJs = typeof module !== "undefined";
var WebSocket = isNodeJs ? require("ws") : WebSocket;
var noop = function noop() {};

/**
 * @param {object} [opts={}]
 * @param {url} [opts.url]
 * @param {object} [opts.after={}]
 */
function Client() {
	var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	this.url = opts.url || "ws://localhost:8123", this.socket = null;
	this.logRecord = [];
	this.after = Object.assign({}, _afterProperties, opts.after || {});
	this.after.constructor();
	this.retryCount = 0;
}

/**
 * Attempts to connect the client to the server.
 * @param {object} [opts={}]
 * @param {boolean} [opts.retry]
 */
Client.prototype.connect = function (opts) {
	this.log("Connecting...");
	try {
		this.socket = new WebSocket(this.url);
		this.socket.addEventListener("open", this.open.bind(this));
		this.socket.addEventListener("close", this.close.bind(this));
		this.socket.addEventListener("error", this.error.bind(this));
		if (opts.retry) {
			this.socket.addEventListener("error", this.retry.bind(this, opts));
		}
	} catch (err) {
		this.log("Catch:" + err);
	}
	this.after.connect();
};

/**
 * Callback for when the connection opens.
 */
Client.prototype.open = function () {
	this.log("Connection opened!");
	this.after.open();
};

/**
 * Callback for when the connection is closed.
 */
Client.prototype.close = function () {
	this.log("Connection closed!");
	this.after.close();
};

/**
 * If failed to connect, this method is for retrying the connection.
 * @param {object} opts
 */
Client.prototype.retry = function (opts) {
	this.retryCount += 1;
	this.log("Retrying connection (" + this.retryCount + ")...");
	this.connect(opts);
};

/**
 * Callback for when there is an error.
 */
Client.prototype.error = function (error) {
	this.log("Error: " + error);
	this.after.error();
};

/**
 * Send the given data to the server.
 * @param {*} data Data to send to the server.
 */
Client.prototype.send = function (data) {
	this.socket.send(data);
	this.after.send();
};

/**
 * Log the given message. Reports this in the regular console or terminal.
 * @param {*} The message, or value to log to console.
 */
Client.prototype.log = function (message) {
	this.logRecord.push(message);
	console.log(message);
	this.after.log();
};

/**
 * Add corresponding "after" functions for each prototype method.
 */
var _afterProperties = function () {
	var object = {};
	var names = Object.getOwnPropertyNames(Client.prototype);
	names.forEach(function (name) {
		object[name] = noop;
	});
	return object;
}();

// Export depending on environment
if (isNodeJs) module.exports = Client;else Window.Client = Client;
