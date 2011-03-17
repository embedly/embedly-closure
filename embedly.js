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
 * Calls Embedly's limited support oembed endpoint -> api.embed.ly
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
 * 
 */ 
embedly.Api.prototype.services = function(params, resultCallback, opt_errorCallback) {
  var jsonp = new goog.net.Jsonp('http://api.embed.ly/1/oembed')
  jsonp.setRequestTimeout(120000)
  jsonp.send(
    params
  , function(objs) {resultCallback(objs)}
  , function(payload) {
      if (opt_errorCallback) {
        opt_errorCallback(payload)
      }
    }
  )
}

/**
 * Generate a giant regex of supported service providers
 * from  api.embed.ly's services endpoint response
 * @param {Function=} resultCallback Callback function expecting one argument 
 *     that is passed resulting object returned from the endpoint.  The result
 *     is an giant regex of all the supported services providers
 *
 * @param {Function=} opt_errorCallback Callback function expecting one
 *     argument.  Usually this is called on a timeout error.
 */ 
embedly.Api.prototype.services_regex = function(resultCallback, opt_errorCallback) {
  var jsonp_service = new goog.net.Jsonp('http://api.embed.ly/1/services/javascript')
  jsonp_service.setRequestTimeout(12000)
  jsonp_service.send({}, function(objs) {
  services = new Array()
  for (obj in objs) 
    services = services.concat(objs[obj]['regex']); 
  services_regexes = services.join('|')
  resultCallback(services_regexes);
  }, opt_errorCallback )
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
 * 
 * ====FLOW====
 * Uses pro.embed.ly if 'key' is supplied, else falls back upon api.embed.ly with limited support
 */

embedly.Api.prototype.call = function(endpoint, params, resultCallback, opt_errorCallback) {
  var path = this.paths[endpoint]
  var jsonp = new goog.net.Jsonp(this.host+path)
  jsonp.setRequestTimeout(this.timeout)
  
  if (!params['key'] && this['key']) {
    params['key'] = this.key
  }
  
  if(!params['key'] && endpoint == 'oembed') {
    
    this.services_regex( 
    function(regex) {
      return_array = new Array()
      new_params_urls = new Array()
      for (each in params['urls']) {
        if(!params['urls'][each].match(regex)) { 
          return_array.push({"url": params['urls'][each], "error_code": 401, "error_message": "This service requires an Embedly Pro account", "type": "error", "version": "1.0"})
        } else {
          return_array.push('valid')
          new_params_urls.push(params['urls'][each])
        }
      }
      if (new_params_urls.length > 0) {
        params['urls'] = new_params_urls
        this.services(
        params, 
        function(objs) {
          objs.reverse()
          for (each in return_array) {
            if (return_array[each] == 'valid')
              return_array[each] = objs.pop()
          } 
          resultCallback(return_array)
        },
        opt_errorCallback)
      } else
      resultCallback(return_array)
    },
    opt_errorCallback)
    
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
