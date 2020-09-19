const debug = require('debug')('tags:logger:request')

function requestDetail (request) {
  const detail = {
    id: request.id,
    httpVersion: request.httpVersion,
    headers: request.headers,
    method: request.method,
    originalUrl: request.originalUrl,
    baseUrl: request.baseUrl,
    url: request.url,
    body: request.body,
    params: request.params,
    query: request.query
  }
  debug({ detail })
  return detail
}

module.exports = requestDetail
