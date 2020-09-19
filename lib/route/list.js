const debug = require('debug')('tags:server:route:list')

const {
  status: {
    OK,
    SERVICE_UNAVAILABLE
  }
} = require('../constant')

const defaultLimit = process.env.SEQUELIZE_PAGE_LIMIT || 10
const defaultOffset = 0
const defaultOrder = 'timestamp'
const defaultSort = 'DESC'

const internals = ['creationDate', 'lastModificationDate']

function andReturn (query, exclude = []) {
  return Object.assign({}, query, { attributes: { exclude } })
}

function byQuery (query = {}) {
  const args = {
    limit: Number(query.limit || defaultLimit),
    offset: Number(query.offset || defaultOffset),
    order: [[query.order || defaultOrder, query.sort || defaultSort]]
  }
  if (query.group) args.group = query.group
  return args
}

// GET /api/list

function handler (data, request, response, next) {
  debug({ request: request.id, query: request.query })
  data.namespace.Tag.findAndCountAll(andReturn(byQuery(request.query), internals))
    .then(tags => {
      response.status(OK).send({
        error: null,
        message: 'listed records',
        payload: tags
      })
    }).catch(error => {
      debug({ error })
      response.status(SERVICE_UNAVAILABLE).send({
        error: true,
        message: '',
        payload: error
      })
    })
}

module.exports = data => {
  debug({ bind: 'data' })
  return handler.bind(null, data)
}
