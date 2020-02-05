import Router from 'koa-router' // 导入koa-router
import { User } from '../schema/user' // 引入User
const bcrypt = require('bcryptjs') // 引入bcryptjs

const router = new Router()

// 测试接口
router.get('/test', async ctx => {
  console.log(123)
  ctx.status = 200
  ctx.body = {
    msg: 'suc!!!!!!!!!!!'
  }
})

// 注册接口
router.post('/register', async ctx => {
  console.log('register suc')

  // 存储到数据库
  const findResult = await User.find({
    account: ctx.request.body.account
  })
  if (findResult.length) {
    ctx.status = 500
    ctx.body = {
      account: '名字已被占用'
    }
  } else {
    const newUser: any = new User({
      account: ctx.request.body.account,
      password: ctx.request.body.password
    })
    // 密码加密
    const salt = bcrypt.genSaltSync(10)
    newUser.password = bcrypt.hashSync(newUser.password, salt)
    const res = await newUser.save()

    ctx.body = res
  }
})

// 登录接口
router.post('/login', async ctx => {
  const findResult: any = await User.findOne({
    account: ctx.request.body.account
  })
  if (!findResult) {
    ctx.status = 404
    ctx.body = {
      msg: '未注册用户'
    }
  } else {
    // 验证密码
    const correct = bcrypt.compareSync(
      ctx.request.body.password,
      findResult.password
    )
    if (correct) {
      ctx.status = 200
      ctx.body = {
        success: true
      }
    } else {
      ctx.status = 400
      ctx.body = {
        password: '密码错误'
      }
    }
  }
})

export const usersRouter = router.routes()
