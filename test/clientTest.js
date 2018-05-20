
var Client = require("./../bin/client.js");

client = new Client();
setTimeout( function() {
	client.connect();
}, 3000 );
