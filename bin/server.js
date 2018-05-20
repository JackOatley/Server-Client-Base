#!/usr/bin/env node
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebSocket = require("ws");

/** Class representing our server. */

var Server = function () {

	/**
  * Create a server.
  * @param {number} options.port The server port.
  */
	function Server() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, Server);

		this.port = options.port || 8123;
		this.socket = null;
		this.connections = [];
		this.logRecord = [];
	}

	/**
  *
  */


	_createClass(Server, [{
		key: "start",
		value: function start() {
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

	}, {
		key: "stop",
		value: function stop(callback) {
			var _this = this;

			this.log("Stopping server...");
			this.socket.close(function () {
				_this.log("Server stopped!");
				callback();
			});
		}

		/**
   *
   */

	}, {
		key: "onConnection",
		value: function onConnection(socket) {
			this.log("Creating new connection...");
			var connection = new Connection(this, socket, {
				logMessages: true
			});
			this.connections.push(connection);
		}

		/**
   *
   */

	}, {
		key: "log",
		value: function log() {
			var s = this;

			for (var _len = arguments.length, message = Array(_len), _key = 0; _key < _len; _key++) {
				message[_key] = arguments[_key];
			}

			message.forEach(function (m) {
				s.logRecord.push(m);
				console.log(m);
			});
		}
	}]);

	return Server;
}();

/** Class representing a connection. */


var Connection = function () {

	/**
  * @param {Server} server
  * @param {WebSocket} socket
  * @param {boolean} options.logMessages
  */
	function Connection(server, socket) {
		var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

		_classCallCheck(this, Connection);

		this.server = server;
		this.socket = socket;
		this.logMessages = options.logMessages || false;
		this.socket.on("message", this.onMessage);
		this.server.log("Connection created!");
	}

	/**
  *
  */


	_createClass(Connection, [{
		key: "onMessage",
		value: function onMessage(message) {}
	}]);

	return Connection;
}();

//


module.exports = Server;
