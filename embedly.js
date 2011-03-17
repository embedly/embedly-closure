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
  this.timeout = args['timeout'] || 120000
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

embedly.Api.prototype.services = function(regex, params, resultCallback, opt_errorCallback, jsonp) {
  rejects = new Array()
  new_params_urls = new Array()
  for (each in params['urls']) {
    if(!params['urls'][each].match(regex)) { 
      rejects.push({"url": params['urls'][each], "error_code": 401, "error_message": "This service requires an Embedly Pro account", "type": "error", "version": "1.0"})
    } else
      new_params_urls.push(params['urls'][each])
  }
  params['urls'] = new_params_urls
  jsonp.send(
    params
  , function(objs) {
      objs = objs.concat(rejects)
      resultCallback(objs)
    }
  , function(payload) {
      if (opt_errorCallback) {
        opt_errorCallback(payload)
      }
    }
  )
}

embedly.Api.prototype.services_regex = function(objs, params, resultCallback, opt_errorCallback, jsonp) {
  services = new Array()
  for (obj in objs) 
    services = services.concat(objs[obj]['regex']); 
  services_regex = services.join('|')
  this.services(services_regex, params, resultCallback, opt_errorCallback, jsonp)
}
  

embedly.Api.prototype.call = function(endpoint, params, resultCallback, opt_errorCallback) {
  var path = this.paths[endpoint]
  var jsonp = new goog.net.Jsonp(this.host+path)
  jsonp.setRequestTimeout(this.timeout)
  
  if (!params['key'] && this['key']) {
    params['key'] = this.key
  }
  
  if(!params['key'] && endpoint == 'oembed') {
    var jsonp_service = new goog.net.Jsonp('http://api.embed.ly/1/services/javascript')
    jsonp_service.setRequestTimeout(this.timeout)
    jsonp_service.send({}, function(objs) {this.services_regex(objs, params, resultCallback, opt_errorCallback, jsonp)})
  } else {
    jsonp.send(
      params
    , function(objs) {
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
