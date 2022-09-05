const express = require('express')
const { getTopics, getArticleById } = require('./controllers/api.topics.contoller')
const { handleServerError } = require('./error_handlers/errors')

const app = express()

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id',getArticleById)

app.use(handleServerError)
module.exports = app