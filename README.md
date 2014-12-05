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
```js
request.post({
  url: 'url',
  data: {},
  headers: {}
});
```

### .download
#### options
If options is string, it will download by default params.
* ``url`` {string} Not null
* ``encoding`` {string} [encoding='utf8']  
If the request is image, the encoding is 'binary', otherwise it's 'utf8'.
* ``extname`` {stringg} [exname='html']  
If the request url don't exists extname, it will think it's html.
* ``ignore`` {boolean} [ignore=false]
Is the filepath ignore case. 
* ``rootPath`` {string} [rootPath='']
* ``destPath`` {string} [destPath]

```js
request.download(
  'http://res.m.ctrip.com/html5/Content/images/57.png', 
  function(err, res, body, filepath) {
  
  }
);

request.download({
  url: '',
  rootPath: ''
}, callback);

request.download({
  url: '',
  destPath: '',             // If use this param, you should assign all file extname 
  encoding: ''
}, callback);
```

### .base64
Http request image, then callback with base64 data.
```
request.base64(
  'http://res.m.ctrip.com/html5/Content/images/57.png', 
  function(err, res, body) {
  
  }
);
```