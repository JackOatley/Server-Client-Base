
var Client = require("./../bin/client.js");

var client = new Client({
	after: {
		constructor: function() {
			console.log("I'm aliiiiiive!");
		},
		connect: function() {
			console.log("Hey, I executed after the internal \"connect\" function!");
		}
	}
});

setTimeout( function() {
	client.connect();
}, 3000 );
