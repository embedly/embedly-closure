goog.provide('embedly.Api')

goog.require('goog.net.Jsonp')

/**
 * Creates a new Embedly api object that can be used to call Embedly
 * endpoints.
 *
 * @param {Object=} args An object with constructor params.  Accepted
 *     params are::
 *       key:     The Embedly Pro api key.  If this is set then we will use
 *                http://pro.embed.ly as the default host.
 *
 *       host:    The Embedly api host.  This is http://pro.embed.ly by 
 *                default if 'key' is set, or http://api.embed.ly otherwise
 *
 *       timeout: Timeout in milis on calls. Default is 120000 (120 seconds)
 *
 * @constructor
 */
embedly.Api = function(args) {
  if (!args) args = {}
  if (args['key']) {
    this.key = args['key']
    this.host = args['host'] || 'http://pro.embed.ly'
  } else {
    this.host = args['host'] || 'http://api.embed.ly'
  }
  this.paths = {
      'oembed': '/1/oembed'
    , 'objectify': '/2/objectify'
    , 'preview': '/1/preview'
  }
  var This = this
  this.timeout = args['timeout'] || 120000
  //this.services_regex = new Array()
  //this.rejects = new Array()
}

/**
 * Call an Embedly endpoint.  The reply is passed to resultCallback.  If no
 * result is recieved before the timeout, then the original url parameters
 * are passed back to the opt_errorCallback.
 *
 * @param {string=} endpoint Either 'oembed', 'objectify' or 'preview'.  For
 *     non-pro accounts, this should always be 'oembed'.
 *
 * @param {Object=} params Name value pairs to send as query params to the
 *     endpoint.  If 'key' was set in the constructor, then it will
 *     automatically be add to the params.  'urls' is required and should
 *     be an array of at least one url.
 *
 * @param {Function=} resultCallback Callback function expecting one argument 
 *     that is passed resulting object returned from the endpoint.  The result
 *     is an array of Objects in that match up to the params.urls in the same
 *     order that they were given.
 *
 * @param {Function=} opt_errorCallback Callback function expecting one
 *     argument.  Usually this is called on a timeout error.
 */

embedly.Api.prototype.services = function(objs) {
  if(!objs) {
  var fetch_service_regex = new goog.net.Jsonp('http://api.embed.ly/1/services/javascript')
  fetch_service_regex.send({}, this.services)
  } else {
    console.log(this);
    console.log(This);
    //this = This;
    _services = new Array();
    for (obj in objs) _services = _services.concat(objs[obj]['regex']); 
    This.services_regex = _services.join('|')
    console.log('this is the services regex string', This.params['urls'])
    for (each in This.params['urls']) {
      console.log(This.params['urls'][each])
      if(!This.params['urls'][each].match(This.services_regex)) { 
        console.log(This.params['urls'][each])
        This.rejects.push({"url": This.params['urls'][each], "error_code": 401, "error_message": "This service requires an Embedly Pro account", "type": "error", "version": "1.0"});
        delete This.params['urls'][each];
        console.log('qwert', This.rejects)
      }
    }
    This.call('oembed', This.params, This.resultCallback, This.opt_errorCallback)
  }  
}

/*
 *
 *     
 * 
    for (each in params['urls']) {
      console.log(params['urls'][each])
      if(!params['urls'][each].match(this.services_regex)) { 
        console.log(params['urls'][each])
        _rejects.push({"url": params['urls'][each], "error_code": 401, "error_message": "This service requires an Embedly Pro account", "type": "error", "version": "1.0"});
        //delete params['urls'][each];
        console.log('rejected url ',_rejects)
      } else
        _params['urls'][each] = params['urls'][each] 
      
    };
    this.rejects = _rejects
    console.log('urlsssss', _params['urls']); 
    this.call('oembed', params, resultCallback, opt_errorCallback);
 * 
 * 
 * 
 */

embedly.Api.prototype.call = function(endpoint, params, resultCallback, opt_errorCallback) {
  console.log(params)
  console.log(this)
  this.params = params
  this.resultCallback = resultCallback 
  this.opt_errorCallback = opt_errorCallback
  
  var path = this.paths[endpoint]
  var jsonp = new goog.net.Jsonp(this.host+path)
  jsonp.setRequestTimeout(this.timeout)
  
  if (!params['key'] && this['key']) {
    params['key'] = this.key
  }
  
  if(!params['key']) {
  console.log(this.params)
    this.services() 
  } else {
  jsonp.send(
      params
    , function(objs) {
      if(this.rejects)
        objs = objs.push(this.rejects)
      resultCallback(objs)
      }
    , function(payload) {
        if (opt_errorCallback) {
          opt_errorCallback(payload)
        }
      }
  )
  }
}
