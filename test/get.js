var assert = require('assert');
var app = require('./service/app');
var util = require('utils-extend');
var request = require('../index');
var server;

describe('Http get', function() {
  // Start service
  beforeEach(function(done){
    server = app.listen(3100, function() {
      done();
    });
  });

  it('Get html', function(done) {
    request('http://127.0.0.1:3100', function(err, res, body) {
      assert.equal(body, 'html');
      done();
    });
  });

  it('isString', function(done) {
    request('http://127.0.0.1:3100/json', function(err, res, body) {
      assert(util.isString(body));
      done();
    });
  });

  it('isJson', function(done) {
    request({
      url: 'http://127.0.0.1:3100/json',
      json: true
    }, function(err, res, body) {
      assert(util.isObject(body));
      done();
    });
  });

  it('querystring', function(done) {
    request({
      url: 'http://127.0.0.1:3100/querystring',
      json: true,
      data: {
        id: 1,
        name: 'douzi'
      }
    }, function(err, res, body) {
      assert(util.isObject(body));

      assert.deepEqual(body, {
        id: 1,
        name: 'douzi'
      });

      done();
    });
  });

  afterEach(function(){
    server.close();
  });
});