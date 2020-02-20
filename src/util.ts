import config from './config'
const jwt = require('jsonwebtoken')

// 校验token
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
          message: '认证失败',
        }
      }
    })
  }
  checkStatus && (await next())
}

// 获取总投票者ID
function getSupportersList(voteOptionList: any) {
  let supportersList: any = []
  voteOptionList.forEach((option: any) => {
    option.supporters.forEach((item: any) => {
      supportersList = supportersList.concat(item.openId)
    })
  })
  return supportersList!
}

// 用户是否投过票
function checkUserVote(voteOptionList: any, openId: String): Boolean {
  const supportersList = getSupportersList(voteOptionList)
  const beforeVote = supportersList.indexOf(openId) === -1 ? true : false
  return beforeVote
}

// 获取投票占比
function getRetio(voteOptionList: any) {
  const total = voteOptionList.reduce((prev: Number, item: any) => {
    return prev + item.count
  }, 0)
  const ratioList = voteOptionList.map((item: any) => {
    if (item.count === 0) return 0
    return Math.round((item.count / total) * 100)
  })
  return ratioList
}

// 过滤失效投票列表
function filterVoteList(voteOptionList: any) {
  const filterList = voteOptionList.filter((item: any) => {
    if (Date.now() < item.endingTime) {
      return true
    } else console.log(item)
  })
  return filterList
}
export { getSupportersList, checkUserVote, getRetio, filterVoteList }
