```js
var request = require('ajax-request');
```

## install
```
npm install ajax-request --save
```

## API
### request(options, callback)
```js
request({
  url: '',
  method: 'GET',
  data: {
    query1: 'value1'
  }
}, function(err, res, body) {
  
});

request('url', function(err, res, body) {});
```
#### options
if options is string, it will send a get http request, otherwise it's object
* ``url`` {string} [url]   
 not empty
* ``method``  {string} [method=GET]  
The http request type
* ``data``  {object} [data]  
if the request type is `GET`, it's appended to query string of the URL, or it's sended to remote of body.
* ``headers`` {object} [headers = { 'Content-Type': 'application/json' }]  
An object containing request headers.
* ``encoding`` {string} [encoding=utf8]  
Encoding to be used on setEncoding of response data

#### callback


### .post
The API same as request
```
request.post({
  url: 'url',
  data: {},
  headers: {}
});
```