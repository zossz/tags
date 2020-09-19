const debug = require('debug')('tags:server:main')

const { v4: uuid } = require('uuid')

const pkg = require('../package')
const route = require('./route')
const { factory } = require('./express')
const { init } = require('./data')
const {
  header: {
    CONTENT_TYPE
  },
  status: {
    NOT_ACCEPTABLE,
    NOT_IMPLEMENTED
  },
  type: {
    JSON
  }
} = require('./constant')

const port = process.env.PORT || process.env.EXPRESS_PORT || 8080
const header = process.env.SERVICE_HEADER_NAME || 'x-service-request'

const assetRegex = new RegExp('^/lib')
const jsonRegex = new RegExp(JSON)

function dashboard (request, response) {
  debug({ dashboard: request.id })
  response.render('dashboard', {
    cache: true,
    heading: 'Tagup back-end Technical Challenge',
    title: 'tags',
    uuid: request.id
  })
}

function middleware (request, response, next) {
  request.id = request.get(header) || uuid()
  response.set(header, request.id)
  const type = request.get(CONTENT_TYPE)
  debug({ request: request.id, method: request.method, type })
  if (request.originalUrl === '/' || request.originalUrl.match(assetRegex)) {
    next() // asset file requests
  } else if (request.accepts(JSON)) {
    if (request.method === 'GET') {
      next() // API read requests
    } else if ((type || '').match(jsonRegex)) {
      next() // API write requests
    } else {
      reject(next) // must POST JSON
    }
  } else {
    reject(next) // must accept JSON
  }
}

function reject (next) {
  const failure = new Error('Unsupported content type')
  failure.status = NOT_ACCEPTABLE
  next(failure)
}

const service = factory(middleware)

service.use('/api', route)
service.use('/', dashboard)

service.use((error, request, response, next) => {
  debug({ error: error.message, request: request.id })
  response.status(error.status || NOT_IMPLEMENTED).send({
    error: true,
    message: error.message,
    request: request.id
  })
})

const timestamp = Date.now()

init().then(() => {
  service.listen(port, () => {
    debug({ active: timestamp, port, service: pkg.name })
  })
}).catch(debug)
