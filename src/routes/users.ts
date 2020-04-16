import Router from 'koa-router' // 导入koa-router
import config from '../config'
import { User } from '../schema/user'
import { checkToken } from '../util'

const rp = require('request-promise')
const jwt = require('jsonwebtoken')

const router = new Router()

router.use('', checkToken)

// 登录接口
router.post('/login', async (ctx) => {
  console.log('user login success')
  // 获取openId
  if (ctx.request.body.code) {
    const options = {
      method: 'POST',
      url: 'https://api.weixin.qq.com/sns/jscode2session?',
      formData: {
        appid: config.appId,
        secret: config.appSecret,
        js_code: ctx.request.body.code,
        grant_type: 'authorization_code',
      },
    }
    const data = JSON.parse(await rp(options))

    // 生成token
    let payload = {
      openId: data.openid,
    }
    let token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: 7200,
    })

    // 查找数据库
    const findResult = await User.findOne({
      openId: data.openid,
    })
    if (findResult) {
      // 每次登录更新数据
      await User.update(
        {
          openId: data.openid,
        },
        {
          userInfo: ctx.request.body.userInfo,
        }
      )
      ctx.body = {
        token,
        openId: data.openid,
      }
    } else {
      const user: any = new User()
      user.openId = data.openid
      user.userInfo = ctx.request.body.userInfo
      await user.save()
      ctx.body = {
        token,
        openId: data.openid,
      }
    }
  }
})

export const usersRouter = router.routes()
