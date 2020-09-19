const debug = require('debug')('tags:server:route')

const data = require('../data')
const express = require('../express')
const {
  charset: { UTF8 },
  status: { OK },
  type: { JSON }
} = require('../constant')

const api = {
  create: require('./create'),
  list: require('./list'),
  modify: require('./modify'),
  read: require('./read'),
  remove: require('./remove')
}

const params = ['timestamp:integer', 'value1:string', 'value2:float', 'value3:boolean']
const query = ['cursor:string', 'limit:integer']
const types = [`${JSON}; ${UTF8}`]

const links = [
  {
    href: 'list',
    rel: 'item',
    type: 'TagList',
    meta: {
      method: 'GET',
      query,
      types
    }
  },
  {
    href: 'read/:id',
    rel: 'item',
    type: 'Tag',
    meta: {
      method: 'GET',
      types
    }
  },
  {
    href: 'create',
    rel: 'item',
    type: 'Tag',
    meta: {
      method: 'POST',
      params,
      types
    }
  },
  {
    href: 'modify/:id',
    rel: 'item',
    type: 'Tag',
    meta: {
      method: 'POST',
      params,
      types
    }
  },
  {
    href: 'remove/:id',
    rel: 'item',
    type: 'Tag',
    meta: {
      method: 'POST',
      types
    }
  }
]

function decorate (request, links) {
  debug({ decorate: links.length })
  return links.map(x => Object.assign({}, x, {
    href: `${request.originalUrl}/${x.href}`
  }))
}

function integrate (type) {
  debug({ integrate: type })
  return api[type](data)
}

function welcome (request, response, next) {
  debug({ welcome: request.id })
  response.status(OK).send({
    error: null,
    message: 'welcome',
    payload: {
      links: decorate(request, links),
      meta: {
        description: 'API usage details',
        name: 'tags'
      }
    }
  })
}

const router = express.router()

router.post('/create', integrate('create'))
router.post('/modify/:id', integrate('modify'))
router.post('/remove/:id', integrate('remove'))

router.get('/list', integrate('list'))
router.get('/read/:id', integrate('read'))
router.get('/', welcome)

module.exports = router
