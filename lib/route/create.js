const debug = require('debug')('tags:server:route:create')

const {
  status: {
    BAD_REQUEST,
    CREATED,
    SERVICE_UNAVAILABLE
  }
} = require('../constant')
const {
  TagInput
} = require('../schema')

const options = {
  allowUnknown: true, // false,
  // convert: false,//true,
  dateFormat: 'utc', // 'iso',
  noDefaults: true, // false,
  stripUnknown: true// { arrays: false, objects: false }
}

// POST /api/create

function handler (data, request, response, next) {
  const input = TagInput.validate(request.body, options)
  debug({ request: request.id, input })
  if (input.error) {
    response.status(BAD_REQUEST).send({
      error: true,
      message: 'validation failure',
      payload: input.error
    })
  } else {
    data.namespace.Tag.create(input.value).then(tag => {
      response.status(CREATED).send({
        error: null,
        message: 'created record',
        payload: {
          id: tag.id,
          timestamp: tag.timestamp,
          value1: tag.value1,
          value2: tag.value2,
          value3: tag.value3
        }
      })
    }).catch(error => {
      debug({ error })
      response.status(SERVICE_UNAVAILABLE).send({
        error: true,
        message: error.message,
        payload: error
      })
    })
  }
}

module.exports = data => {
  debug({ bind: 'data' })
  return handler.bind(null, data)
}
