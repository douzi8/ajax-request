/**
 * @fileoverview Http request in node.js
 * @author douzi <liaowei08@gmail.com> 
 */
var http = require('http');
var util = require('utils-extend');
var url = require('url');
var path = require('path');
var querystring = require('querystring');
var file = require('file-system');

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
  }

  options = util.extend(defaults, options);
  delete options.url;

  if (options.data) {
    if (options.method === 'GET') {
      requestUrl = requestUrl + '?' + querystring.stringify(options.data);
    } else {
      data = JSON.stringify(options.data);
      options.headers['Content-Length'] = data.length;
    }
  }

  requestUrl = url.parse(requestUrl);
  
  ['hostname', 'port', 'path', 'auth'].forEach(function(item) {
    if (!requestUrl[item]) return;
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

/**
 * @description
 * Download remote resurce to local file
 */
request.download = function(options, callback) {
  var defaults = {
    rootPath: '',
    encoding: 'utf8',
    extname: 'html',
    ignore: false
  };

  if (util.isString(options)) {
    options = util.extend(defaults, {
      url: options
    });
  } else {
    options = util.extend(defaults, options);
  }
  
  var extname = path.extname(options.url);
  var imgs = ['png', 'jpeg', 'jpg', 'gif'];

  if (imgs.indexOf[extname] != -1) {
    options.encoding = 'binary';
  }

  request({
    url: options.url,
    encoding: options.encoding
  }, function(err, res, body) {
    if (err) return callback(err);
    if (res.statusCode !== 200) return callback(err, res, body);
    var destPath;
    
    if (options.destPath) {
      destPath = options.destPath;
    } else {
      destPath = path.join(
        options.rootPath, 
        url.parse(options.url).pathname.replace(/^\//, '')
      );
    }

    if (!extname) {
      if (/\/$/.test(destPath)) {
        destPath +=  'index.' + options.extname;
      } else {
        destPath +=  '.' + options.extname;
      }
    }

    if (options.ignore) {
      destPath = destPath.toLowerCase();
    }

    // Write file
    file.writeFile(destPath, body, {
      encoding: options.encoding
    }, function(err) {
      if (err) return callback(err);

      callback(null, res, body, destPath);
    });
  });
};

/**
 * @description
 * Http request image, then callback with base64 data.
 * @example
 * request.base64(
 *   'https://www.google.com/images/errors/logo_sm_2_hr.png', 
 *   function(err, res, body) {
 * 
 *   }
 * );
 */
request.base64 = function(url, callback) {
  request({
    url: url,
    encoding: 'binary'
  }, function (err, res, body) {
    if (err) return callback(err);

    var data = 'data:' + res.headers['content-type'] + ';base64,' + 
           new Buffer(body, 'binary').toString('base64');

    callback(err, res, data);
  });
};

module.exports = request;