const Joi = require('joi')
const { v4: uuid } = require('uuid')

function generateUUID () {
  return uuid()
}

generateUUID.description = 'generated uuid'

const TagInput = Joi.object({
  timestamp: Joi.date()
    .timestamp()
    .required(),
  value1: Joi.string()
    .min(0)
    .max(80)
    .required(),
  value2: Joi.number()
    .precision(10)
    .required(),
  value3: Joi.boolean()
    .required()
})

const Tag = TagInput.append({
  id: Joi.string()
    .guid({ version: ['uuidv4'] })
    .default(generateUUID),
  creationDate: Joi.date()
    .timestamp()
    .default(Date.now),
  lastModificationDate: Joi.date()
    .timestamp()
    .default(Date.now)
})

function middleware (request, response, next) {
  next()
}

module.exports = {
  Tag,
  TagInput,
  middleware
}
