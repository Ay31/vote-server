import Router from 'koa-router' // 导入koa-router
// import config from '../config'
// import { User } from '../schema/user'
import { Vote } from '../schema/vote'
import { checkToken } from '../util'
// const rp = require('request-promise')
// const jwt = require('jsonwebtoken')

const router = new Router()

router.use('', checkToken)

// 测试接口
router.get('/test', ctx => {
  console.log('vote test success')
  ctx.status = 200
  ctx.body = {
    suc: 'test'
  }
})

router.post('/createVote', ctx => {
  console.log(ctx.request.body)
  // const newVote = new Vote()
})

export const voteRouter = router.routes()
