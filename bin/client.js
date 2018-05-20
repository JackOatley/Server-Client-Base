#!/usr/bin/env node
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebSocket = require("ws");

/** Class representing a client. */

var Client = function () {

	/**
  *
  */
	function Client() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, Client);

		this.url = options.url || "ws://localhost:8123", this.socket = null;
		this.logRecord = [];
	}

	/**
  *
  */


	_createClass(Client, [{
		key: "connect",
		value: function connect() {
			this.log("Connecting...");
			this.socket = new WebSocket(this.url);
			this.socket.addEventListener("open", this.onOpen.bind(this));
			this.socket.addEventListener("error", this.onError.bind(this));
		}

		/**
   *
   */

	}, {
		key: "onOpen",
		value: function onOpen() {
			this.log("Connection opened!");
		}

		/**
   *
   */

	}, {
		key: "onError",
		value: function onError(error) {
			this.log(error);
		}

		/**
   *
   */

	}, {
		key: "log",
		value: function log(message) {
			this.logRecord.push(message);
			console.log(message);
		}
	}]);

	return Client;
}();

//


module.exports = Client;
exports.default = Client;
