import config from './config'
import { Vote } from './schema/vote'
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

// 汇总数据处理
function getVoteAnalysis(voteData: any) {
  const detailData = []
  const data = voteData.voteOptionList
  for (let i = 0; i < data.length; i++) {
    const cityData = getItemAnalysis(data[i].supporters, 'city')
    const languageData = getItemAnalysis(data[i].supporters, 'language')
    const countryData = getItemAnalysis(data[i].supporters, 'country')
    detailData.push({
      cityData,
      languageData,
      countryData,
    })
  }
  // const testData = voteData.voteOptionList[0].supporters
  // const arr = getItemAnalysis(testData, 'city')
  console.log(detailData)
  return detailData
}

// 分析函数
function getItemAnalysis(data: any, name: any) {
  let arr = []
  let count = 0
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      arr.push({
        count: 1,
        name: data[i][name],
      })
      count++
    } else {
      let flag = false
      arr.forEach((item: any) => {
        if (item.name === data[i][name]) {
          item.count++
          count++
          flag = true
        }
      })
      if (!flag) {
        arr.push({
          count: 1,
          name: data[i][name],
        })
        count++
      }
    }
  }
  arr.forEach((item: any) => {
    item.value = (item.count / count) * 100
  })
  return arr
}
export {
  getSupportersList,
  checkUserVote,
  getRetio,
  filterVoteList,
  getVoteAnalysis,
}
