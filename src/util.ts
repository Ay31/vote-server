import config from './config'
const jwt = require('jsonwebtoken')

// 校验token接口
export const checkToken = async (ctx: any, next: any) => {
  const token = ctx.request.header.authorization
  let checkStatus = true
  if (token) {
    jwt.verify(token, config.jwtSecret, (err: Error, decoded: any) => {
      if (err) {
        checkStatus = false
        console.log(err)
      }
      if (decoded.openId) {
        console.log('认证成功')
      } else {
        checkStatus = false
        console.log('认证失败')
        ctx.status = 401
        ctx.body = {
          message: '认证失败'
        }
      }
    })
  }
  checkStatus && (await next())
}

// 获取投票者ID
function getSupportersList(voteOptionList: any) {
  let supportersList: any = []
  voteOptionList.forEach((option: any) => {
    supportersList = supportersList.concat(option.supporters)
  })
  return supportersList!
}

export { getSupportersList }
