goog.provide('embedly.Api')

goog.require('goog.net.Jsonp')

/**
 * @constructor
 */
embedly.Api = function(args) {
  this.host = args['host'] || 'http://pro.embed.ly'
  this.paths = {
      'oembed': '/1/oembed'
    , 'objectify': '/2/objectify'
    , 'preview': '/1/preview'
  }
  this.key = args['key']
}

embedly.Api.prototype.call = function(args) {
  var path = this.paths[args['endpoint']]
  //var encoded_urls = []
  //for (i in args['urls']) {
   // encoded_urls.push(encodeURIComponent(args['urls'][i]))
  //}
  var jsonp = new goog.net.Jsonp(this.host+path)
  var payload = {
      'key': this.key
    , 'urls': args['urls']
  }
  jsonp.send(
      payload
    , function() {
        args.complete(arguments)
      }
    , function() {
        args.error(arguments)
      }
  )
}

goog.exportSymbol('embedly.Api', embedly.Api)
goog.exportProperty(embedly.Api.prototype, 'call', embedly.Api.prototype.call)

if (typeof(embedlyOnLoad) == 'function') {
  embedlyOnLoad()
}
