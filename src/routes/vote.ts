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
  ctx.body = {
    suc: 'test'
  }
})

router.post('/createVote', async ctx => {
  console.log('createVote接口')
  const newVote = new Vote(ctx.request.body)

  try {
    const result = await newVote.save()
    ctx.body = {
      message: '保存成功',
      result
    }
    console.log('保存成功')
  } catch (error) {
    console.error(error)
  }
})

export const voteRouter = router.routes()
