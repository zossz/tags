const nullClientID = '00000000-0000-0000-0000-000000000000'

const defaultMax = 5
const defaultOffset = 0
const defaultOrder = 'timestamp'
const defaultSort = 'ASC'

const templateDefaults = {
  id: null,
  timestamp: 0,
  value1: '',
  value2: 0.0,
  value3: false
}

// DOM references
let client, controls, count, cursor, debug, originalHTML, range, root, tags

// pagination info
let group, max, offset, order, sort

function buttonLabel (x) {
  return (x.id && x.id !== templateDefaults.id) ? 'save' : 'add new'
}

async function dispatch (endpoint, body) {
  const request = {
    headers: {
      'x-tagup-request': sessionStorage.tagupClientID || nullClientID
    },
    method: 'GET'
  }
  if (body) {
    request.headers['content-type'] = 'application/json; charset=utf-8'
    request.method = 'POST'
    request.body = JSON.stringify(body)
  }
  let response
  try {
    response = await (await fetch(`/api/${endpoint}`, request)).json()
  } catch (error) {
    console.warn(error)
  }
  return response
}

function display (data) {
    setDebug(data)
    setStatus()
    setTags()
}

function filter (limit) {
  return `limit=${limit || max || defaultMax}&offset=${offset || defaultOffset}&order=${order || defaultOrder}&sort=${sort || defaultSort}`
}

function getCount () {
  return JSON.parse(sessionStorage[filter()]).count
}

function getInput (form) {
  return {
    value1: form[1].value,
    value2: form[2].value,
    value3: form[3].checked,
    timestamp: form[4].value,
    id: form[5].value
  }
}

function getTags () {
  return JSON.parse(sessionStorage[filter()]).rows
}

// eslint-disable-next-line
function modifyTag () {
  const { form } = event.target
  const tag = getInput(form)
  dispatch(`modify/${tag.id}`, tag).then(display)
}

function pageBack () {
  offset = Number(offset || defaultOffset) - Number(max)
  updateTags().then(display)
}

function pageNext () {
  offset = Number(offset || defaultOffset) + Number(max)
  updateTags().then(display)
}

function refreshRoot (tag) {
  setDebug(tag)
}

// eslint-disable-next-line
function removeTag () {
  const tag = getInput(event.target.form)
  dispatch(`remove/${tag.id}`, tag).then(updateTags).then(display)
}

// eslint-disable-next-line
function saveTag () {
  const tag = getInput(event.target.form)
  if (tag.id && tag.id !== 'null') {
    dispatch(`modify/${tag.id}`, tag).then(display)
  } else {
    delete tag.id
    dispatch('create', tag).then(updateTags).then(display)
  }
}

function setData (data) {
  sessionStorage[filter()] = JSON.stringify(data.payload)
  return data
}

function setDebug (data) {
  debug.innerHTML = `<h3>debug</h3><pre>${JSON.stringify(data, null, 2)}</pre>`
}

function setLimit (x) {
  if (x) {
    max = x
    range.value = max
  } else {
    max = event.target.value
  }
  limit.innerHTML = max
  sessionStorage.tagupPageSize = max
  return updateTags()
}

function setStatus () {
  let z = filter().split('&').reduce((o, x) => {
    let [ k, v ] = x.split('=')
    o[k] = v
    return o
  }, {})
  let start = Number(z.offset) + 1
  let end = Number(z.offset) + Number(z.limit)
  let total = getCount()
  if (end < 0) end = total
  count.innerText = `${start} - ${end < total ? end : total} (of ${total})`
}

function setRoot () {
  if (!originalHTML) originalHTML = root.innerHTML
  root.innerHTML = `${originalHTML}${templateForm()}`
}

function setTags () {
  let q = getTags().map(templateForm)
  q.push(templateForm())
  tags.innerHTML = q.join('')
}

function showAll () {
  setLimit(-1).then(display)
}

function showButton (id) {
  let x = ''
  if (id && id !== 'null') {
    x = '<button type="button" id="remove" name="remove" onclick="removeTag()">remove</button>'
  }
  return x
}

function templateForm (input = {}) {
  const tag = Object.assign({}, templateDefaults, input)
  return `
  <form id="${tag.id}" method="POST">
    <fieldset>
      <legend>${tag.id === null ? 'create tag' : tag.id}</legend>
      <label for="value1">value1</label>
      <input id="value1" name="value1"
        placeholder="<string>" type="text" value="${tag.value1 || ''}" />
      <label for="value2">value2</label>
      <input id="value2" name="value2"
        placeholder="<float>" type="text" value="${tag.value2 || ''}" />
      <label for="value3">value3</label>
      <input id="value3" name="value3" type="checkbox" ${tag.value3 && 'checked'} />
      <br/><br/>
      <label for="timestamp">timestamp</label>
      <input id="timestamp" name="timestamp"
        placeholder="<integer>" type="text" value="${tag.timestamp || ''}" />
      <label></label>
      <input id="id" name="id" type="hidden" value="${tag.id === 'null' ? '' : tag.id}" />
      <button type="button" id="save" name="save" onclick="saveTag()">${buttonLabel(tag)}</button>
      ${showButton(tag.id)}
    </fieldset>
  </form>`
}

function updateTags () {
  return dispatch(`list?${filter()}`).then(setData)
}

function init () {
  client = document.querySelector('.request')
  sessionStorage.tagupClientID = client.innerHTML
  controls = document.querySelector('#controls')
  count = document.querySelector('#count')
  cursor = document.querySelector('#cursor')
  debug = document.querySelector('#debug')
  range = document.querySelector('#range')
  root = document.querySelector('#root')
  tags = document.querySelector('#tags')
  setLimit(sessionStorage.tagupPageSize || defaultMax).then(display)
}

window.onload = init
