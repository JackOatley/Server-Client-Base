
var Client = require("./../bin/client.js");

var client = new Client({
	after: {
		open: function() {
			client.send("Hey you, server!");
		}
	}
});

client.connect({ retry: true });
