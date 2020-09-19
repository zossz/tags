const debug = require('debug')('tags:logger:response')

const header = process.env.SERVICE_HEADER_NAME || 'x-service-request'

function responseDetail (response) {
  const detail = {
    id: response.get(header),
    size: response._contentLength,
    statusCode: response.statusCode,
    statusMessage: response.statusMessage
  }
  debug({ detail })
  return detail
}

module.exports = responseDetail
