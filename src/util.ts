import config from './config'
const jwt = require('jsonwebtoken')

// 校验token接口
export const checkToken = (ctx: any, next: any) => {
  const token = ctx.request.header.authorization
  console.log(token)
  if (token) {
    jwt.verify(token, config.jwtSecret, (err: Error, decoded: any) => {
      if (err) {
        console.log(err)
      }
      if (decoded.openId) {
        console.log('认证成功')
        next()
      } else {
        console.log('认证失败')
        ctx.status = 401
        ctx.body = {
          message: '认证失败'
        }
      }
    })
  }
}
