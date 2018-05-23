#!/usr/bin/env node
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebSocket = require("ws");
var noop = function noop() {};

/** Class representing a client. */

var Client = function () {

	/**
  * @param {object} options
  * @param {url} options.url
  * @param {object} options.after
  */
	function Client() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, Client);

		this.url = options.url || "ws://localhost:8123", this.socket = null;
		this.logRecord = [];
		this.after = Object.assign({}, _afterProperties, options.after || {});
		this.after.constructor();
		this.retryCount = 0;
	}

	/**
  * @param {object} options
  * @param {boolean} options.retry
  */


	_createClass(Client, [{
		key: "connect",
		value: function connect(options) {
			this.log("Connecting...");
			try {
				this.socket = new WebSocket(this.url);
				this.socket.addEventListener("open", this.open.bind(this));
				this.socket.addEventListener("close", this.close.bind(this));
				this.socket.addEventListener("error", this.error.bind(this));
				if (options.retry) {
					this.socket.addEventListener("error", this.retry.bind(this, options));
				}
			} catch (err) {
				this.log("Catch:" + err);
			}
			this.after.connect();
		}

		/**
   *
   */

	}, {
		key: "open",
		value: function open() {
			this.log("Connection opened!");
			this.after.open();
		}

		/**
   *
   */

	}, {
		key: "close",
		value: function close() {
			this.log("Connection closed!");
			this.after.close();
		}

		/**
   *
   */

	}, {
		key: "retry",
		value: function retry(options) {
			this.retryCount += 1;
			this.log("Retrying connection (" + this.retryCount + ")...");
			this.connect(options);
		}

		/**
   *
   */

	}, {
		key: "error",
		value: function error(_error) {
			this.log("Error: " + _error);
			this.after.error();
		}

		/**
   *
   */

	}, {
		key: "send",
		value: function send(data) {
			this.socket.send(data);
			this.after.send();
		}

		/**
   *
   */

	}, {
		key: "log",
		value: function log(message) {
			this.logRecord.push(message);
			console.log(message);
			this.after.log();
		}
	}]);

	return Client;
}();

/**
 *
 */


var _afterProperties = function () {
	var object = {};
	var names = Object.getOwnPropertyNames(Client.prototype);
	names.forEach(function (name) {
		object[name] = noop;
	});
	return object;
}();

//
module.exports = Client;
exports.default = Client;
