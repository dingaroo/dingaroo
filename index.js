/*
 * Primary file for the API
 *
 */

 // Dependencies
 const http = require("http");
 const url = require("url");
 const StringDecoder = require('string_decoder').StringDecoder;
 const config = require('./config.js');

 // the server should respond to all requests with a string
 const server = http.createServer(function(req, res) {
    
    // get the url and parse it
    var parsedUrl = url.parse(req.url, true);

    // get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // get the query string as an object
    var queryStringObject = parsedUrl.query;

    // get the HTTP method
    // var method = req.method.toLowerCase();
    var method = req.method;
        
    // get the headers as an object
    var headers = req.headers;

    // get the payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data) {
        buffer += decoder.write(data);
    });
    req.on('end', function() {
        buffer += decoder.end();

        // choose the handler this request should go to. if one is not found
        // use the not found handler
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // construct the data object to send to the handler
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers': headers,
            'payload': buffer
        };

        // route the request to the handler specified in the router
        chosenHandler(data, function(statusCode, payload) {
            // use the status code called back by the handler, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            // use the payload called back by the handler, or default to an empty object
            payload = typeof(payload) == 'object' ? payload : {};

            // convert the payload to a string
            var payloadString = JSON.stringify(payload);

            // return the response
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // log the request path
            console.log("Request is received on this path: " + trimmedPath + " with this method: " + method);
            console.log("with these query string parameters: ", queryStringObject);
            console.log("Requets received with these headers:", headers);
            console.log("Requests received with this payload: ", buffer);
            console.log("Returning this response: " , statusCode, payloadString);

        });
    });
 });

 // start the server, and listen on port 3000
 server.listen(config.port, function () {
     console.log("The server is listening on port " + config.port + " in " + config.envName + " mode.");
 }); 

 // define the handlers
 const handlers = {};

 // sample handler
 handlers.sample = function(data, callback) {
    // callback a http status code and a payload object
    callback(406,{'name':'sample handler'});
 };

 // not found handler
 handlers.notFound = function(data, callback) {
    callback(404);
 };

 // defining a request router
 const router = {
    'sample': handlers.sample,
 };