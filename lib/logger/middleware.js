const requestDetail = require('./request-detail')
const responseDetail = require('./response-detail')

function convert (hrtime, seconds = false) {
  const nanoseconds = (hrtime[0] * 1e9) + hrtime[1]
  const divisor = seconds ? 1e9 : 1e6
  return nanoseconds / divisor // milliseconds by default
}

function handler (logger, time, request, response) {
  const { start, datetime, timestamp } = time
  const duration = convert(process.hrtime(start))
  logger.info({
    datetime,
    request: Object.assign(requestDetail(request), { timestamp }),
    response: Object.assign(responseDetail(response), { duration })
  })
}

function middleware (logger, request, response, next) {
  const time = {
    start: process.hrtime(),
    datetime: new Date().toISOString(),
    timestamp: Date.now()
  }
  response.on('finish', handler.bind(null, logger, time, request, response))
  next()
}

function factory (logger = console) {
  return middleware.bind(null, logger)
}

module.exports = factory
