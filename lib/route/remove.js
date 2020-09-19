const debug = require('debug')('tags:server:route:remove')

const {
  status: {
    BAD_REQUEST,
    OK,
	SERVICE_UNAVAILABLE
  }
} = require('../constant')

// POST /api/remove/:id

function handler (data, request, response, next) {
  if (!request.params.id) {
    const failure = new Error('missing parameter')
    failure.status = BAD_REQUEST
    next(failure)
  } else {
    debug({ remove: request.params.id, request: request.id })
    data.namespace.Tag.findByPk(request.params.id).then(async tag => {
      try {
        await tag.destroy()
      } catch (error) {
        debug({ error, request: request.id })
      }
      response.status(OK).send({
        error: null,
        message: 'removed record',
        payload: tag
      })
    }).catch(error => {
      error.status = SERVICE_UNAVAILABLE
      next(error)
    })
  }
}

module.exports = data => {
  debug({ bind: 'data' })
  return handler.bind(null, data)
}
