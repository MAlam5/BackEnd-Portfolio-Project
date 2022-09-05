const express = require('express')
const { getTopics } = require('./controllers/api.topics.contoller')

const app = express()

app.get('/api/topics', getTopics)

module.exports = app