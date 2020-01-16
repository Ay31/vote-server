const Koa = require('koa')
const koaBody = require('koa-body')
const mongoose = require('mongoose')
const router = require('koa-router')()

const DB_URL = 'mongodb://localhost:27017/book'
// mongoose.connect(DB_URL)

const app = new Koa()

app.listen(8888, function() {
  console.log('server connect, listening at http://localhost:8888')
})
