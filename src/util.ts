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
        ctx.status = 401
        ctx.body = {
          message: '认证失败',
        }
        console.log(err)
        return
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
    const provinceData = getItemAnalysis(data[i].supporters, 'province')
    // const countryData = getItemAnalysis(data[i].supporters, 'country')
    const genderData = getItemAnalysis(data[i].supporters, 'gender')
    genderData.forEach((item: any) => {
      item.name = item.name.replace(/1\(/, '男性(')
      item.name = item.name.replace(/2\(/, '女性(')
      item.name = item.name.replace(/0\(/, '保密(')
    })
    const avatarData: any = []
    data[i].supporters.forEach((item: any) => {
      avatarData.push(item.avatarUrl)
    })
    detailData.push({
      cityData,
      provinceData,
      // countryData,
      genderData,
      avatarData,
    })
  }
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
    item.value = Math.floor((item.count / count) * 100)
    item.name = item.name + `(${item.value}%)`
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
