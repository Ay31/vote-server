import Router from 'koa-router' // 导入koa-router
// import { Token } from '../schema/token' // 引入User
const request = require('request')
var rp = require('request-promise')

const jwt = require('jsonwebtoken')

const router = new Router()

// router.use('/', () => console.log(123))

router.post('/', async ctx => {
  if (ctx.request.body.code) {
    const options = {
      method: 'POST',
      url: 'https://api.weixin.qq.com/sns/jscode2session?',
      formData: {
        appid: 'wxf15c9d3274a0409c',
        secret: '33afaa92e96d18bd9f5d711d5f674f17',
        js_code: ctx.request.body.code,
        grant_type: 'authorization_code'
      }
    }
    const data = await rp(options)

    // 生成token
    let payload = {
      session_key: data.session_key,
      oppenid: data.oppenid,
      code: ctx.request.body.code
    }
    let token = jwt.sign(payload, 'secret', {
      expiresIn: 2592000
    })

    // 返回
    ctx.status = 200
    ctx.body = {
      status: 'success',
      token
    }
  }
})

export const tokenRouter = router.routes()
