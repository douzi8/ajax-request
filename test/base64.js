var assert = require('assert');
var app = require('./service/app');
var util = require('utils-extend');
var request = require('../index');
var fs = require('file-system');
var path = require('path');
var srcPath = path.join(__dirname, 'service/assets');

describe('Base64 request', function() {
  // Start service
  beforeEach(function(done){
    server = app.listen(3100, function() {
      done();
    });
  });

  it('base64', function(done) {
    var img = 'data:image/png;base64,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';

    request.base64('http://127.0.0.1:3100/index.png', function(err, res, body) {
      assert.equal(body, img);
      done();
    });
  });

  afterEach(function(){
    server.close();
  });
});