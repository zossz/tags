const debug = require('debug')('tags:server:route:read')

const {
  status: {
    BAD_REQUEST,
    NOT_FOUND,
    OK,
    SERVICE_UNAVAILABLE
  }
} = require('../constant')

// GET /api/read/:id

function handler (data, request, response, next) {
  if (!request.params.id) {
    const failure = { error: true, message: 'missing parameter', payload: null }
    response.status(BAD_REQUEST).send(failure)
  } else {
    debug({ request: request.id })
    data.namespace.Tag.findByPk(request.params.id).then(tag => {
      if (tag) {
        response.status(OK).send({
          error: null,
          message: 'read record',
          payload: tag
        })
      } else {
        response.status(NOT_FOUND).send({
          error: true,
          message: 'missing record',
          payload: request.params.id
        })
      }
    }).catch(error => {
      debug({ error })
      response.status(SERVICE_UNAVAILABLE).send({
        error: true,
        message: '',
        payload: error
      })
    })
  }
}

module.exports = data => {
  debug({ bind: 'data' })
  return handler.bind(null, data)
}
