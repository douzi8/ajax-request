/**
 * @fileoverview Http request in node.js
 * @author douzi <liaowei08@gmail.com> 
 */
var http = require('http');
var util = require('utils-extend');
var url = require('url');
var querystring = require('querystring');

/**
 * @description
 * http request
 * @param {object|string} [options]
 * @param {function} [callback]
 * @example
 * request('url', function(err, res, body) { });
 * request({url: '', headers: {}, method: 'POST'}, function(err, res, body) { });
 */
function request(options, callback) {
  var defaults = {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'GET',
    encoding: 'utf8',
    json: false
  };
  var data;

  if (util.isString(options)) {
    requestUrl = options;
    options = {};
  } else {
    requestUrl = options.url;
    delete options.url;
  }

  options = util.extend(defaults, options);

  if (options.data) {
    if (options.method === 'GET') {
      requestUrl = requestUrl + '?' + querystring.stringify(options.data);
    } else {
      data = JSON.stringify(options.data);
      options.headers['Content-Length'] = data.length;
    }
  }

  requestUrl = url.parse(requestUrl);
  
  ['hostname', 'port', 'path'].forEach(function(item) {
    options[item]  = requestUrl[item];
  });

  var req = http.request(options, function(res) {
    var body = '';

    res.setEncoding(options.encoding);

    res.on('data', function (chunk) {
      body += chunk;
    });

    res.on('end', function() {
      if (options.json) {
        body = JSON.parse(body);
      }
      callback(null, res, body);
    });
  });

  req.on('error', callback);

  if (options.method !== 'GET' && data) {
    req.write(data);
  }

  req.end();
}

/**
 * @description
 * @example
 * request.post('url', function() {});
 * request.post({ url: 'url', data: { q1: 'v1' }}, function() {});
 */
request.post = function(options, callback) {
  if (util.isString(options)) {
    options = {
      url: options
    };
  }

  options.method = 'POST';
  request(options, callback);
};

module.exports = request;
