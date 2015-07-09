// Where do we listen to incoming connections?
var port = process.env.PORT || 3000;

// Whitelist of CORS enabled domains:
var whitelist = [
  'http://127.0.0.1:31337',
  'http://0.0.0.0:31337',
  'http://npmdocs.github.io'
];

// Where to proxy requests:
var endpoint = 'https://skimdb.npmjs.com';

var express = require('express');
var cors = require('cors');
var proxy = require('express-http-proxy');

var app = express();
app.use('/*', cors(corsOptionsDelegate), createProxyRoute());
app.listen(port, function() {
  console.log('Registry proxy started at: http://localhost:' + port);
});

function createProxyRoute() {
  return proxy(endpoint, {
    forwardPath: function(req) { return req.originalUrl; }
  });
}

function corsOptionsDelegate(req, cb) {
  var allow = whitelist.indexOf(req.header('Origin')) >= 0;
  console.error('Registry access request for %s: %s',
                req.header('Origin'), allow ? 'Allow' : 'Deny');
  cb(null, { origin: allow });
}
