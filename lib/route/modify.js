const debug = require('debug')('tags:server:route:modify')

const {
  status: {
    BAD_REQUEST,
    OK,
	SERVICE_UNAVAILABLE
  }
} = require('../constant')
const {
  TagInput
} = require('../schema')

const options = {
  allowUnknown: true, // false,
  // convert: false, // true,
  dateFormat: 'utc', // 'iso',
  noDefaults: true, // false,
  stripUnknown: true // { arrays: false, objects: false }
}

function byID (request) {
	return { where: { id: request.params.id } }
}

// POST /api/modify/:id

function handler (data, request, response, next) {
  if (!request.params.id) {
    const failure = new Error('missing parameter')
    failure.status = BAD_REQUEST
    next(failure)
  } else {
    debug({ modify: request.params.id, request: request.id })
    const input = TagInput.validate(request.body, options)
    if (input.error) {
      response.status(BAD_REQUEST).send({
        error: input.error,
        message: 'validation failure',
        payload: null
      })
    } else {
      data.namespace.Tag.update(input.value, byID(request)).then(n => {
        response.status(OK).send({
          error: null,
          message: 'updated record',
          payload: Object.assign(input.value, {
            id: request.params.id,
            timestamp: input.value.timestamp.valueOf()
      	  })
        })
      }).catch(error => {
        error.status = SERVICE_UNAVAILABLE
        next(error)
      })
    }
  }
}

module.exports = data => {
  debug({ bind: 'data' })
  return handler.bind(null, data)
}
