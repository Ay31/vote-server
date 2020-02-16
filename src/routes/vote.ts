import Router from 'koa-router' // 导入koa-router
// import config from '../config'
// import { User } from '../schema/user'
import { Vote } from '../schema/vote'
import { checkToken, getSupportersList } from '../util'
// const rp = require('request-promise')
// const jwt = require('jsonwebtoken')

const router = new Router()

router.use('', checkToken)

// 测试接口
router.get('/test', ctx => {
  console.log('vote test success')
  ctx.body = {
    suc: 'test',
  }
})

// 创建投票接口
router.post('/createVote', async ctx => {
  console.log('createVote接口')
  const newVote = new Vote(ctx.request.body)

  try {
    const result = await newVote.save()
    ctx.body = {
      message: '保存成功',
      result,
    }
    console.log('保存成功')
  } catch (error) {
    console.error(error)
  }
})

// 获取投票详情接口
router.get('/getVoteDetail', async ctx => {
  console.log('获取投票详情接口')
  const voteId = ctx.request.query.voteId

  const voteDetail: any = await Vote.findOne({
    _id: voteId,
  })
  console.log(voteDetail)
  const supportersList: String[] = getSupportersList(voteDetail.voteOptionList)

  ctx.body = {
    voteDetail,
    beforeVote:
      supportersList.indexOf(ctx.request.query.openId) === -1 ? true : false,
  }
})

// 提交投票选项接口
router.post('/submitVote', async ctx => {
  console.log('submitVote suc')
  const { optionId, openId, voteId, userInfo } = ctx.request.body
  await Vote.update(
    {
      _id: voteId,
      'voteOptionList._id': optionId,
    },
    {
      $push: {
        'voteOptionList.$.supporters': Object.assign({ openId }, userInfo),
      },
      $inc: { 'voteOptionList.$.count': 1 },
    }
  )
  ctx.body = {
    msg: '提交投票成功',
  }
})

export const voteRouter = router.routes()
