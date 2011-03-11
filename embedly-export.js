goog.provide('embedly.exports')
goog.require('embedly.Api')

goog.exportSymbol('embedly.Api', embedly.Api)
goog.exportProperty(embedly.Api.prototype, 'call', embedly.Api.prototype.call)

if (typeof(embedlyOnLoad) == 'function') {
  embedlyOnLoad()
}
