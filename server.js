// Require our dependencies
var express = require('express'),
	http	= require('http'),
	slashes = require('connect-slashes');

// Create an express instance and set a port variable
var app = express();
var port = process.env.PORT || 8080;

app.use(function(req, res, next) {

	if (req.originalUrl.search('/page') > -1) {
		return res.redirect(301, '/');
	}

	return next();
});

app.use("/spotter", express.static(__dirname + "/public/index.html"));
// Set /public as our static content dir
app.use("/", express.static(__dirname + "/public/"));

// Fire this bitch up (start our server)
var server = http.createServer(app).listen(port, function() {
	console.log('Express server listening on port ' + port);
});
