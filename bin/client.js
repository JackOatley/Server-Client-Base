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
	}

	/**
  *
  */


	_createClass(Client, [{
		key: "connect",
		value: function connect(options) {
			this.log("Connecting...");
			this.socket = new WebSocket(this.url);
			this.socket.addEventListener("open", this.onOpen.bind(this));
			this.socket.addEventListener("error", this.onError.bind(this));
			this.after.connect();
		}

		/**
   *
   */

	}, {
		key: "onOpen",
		value: function onOpen() {
			this.log("Connection opened!");
			this.after.onOpen();
		}

		/**
   *
   */

	}, {
		key: "onClose",
		value: function onClose() {
			this.log("Connection closed!");
			this.after.onClose();
		}

		/**
   *
   */

	}, {
		key: "onError",
		value: function onError(error) {
			this.log(error);
			this.after.onError();
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
