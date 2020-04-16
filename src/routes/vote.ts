import Router from 'koa-router' // 导入koa-router
import { Vote } from '../schema/vote'
import { User } from '../schema/user'
import { checkToken, checkUserVote, getRetio, getVoteAnalysis } from '../util'

const router = new Router()

router.use('', checkToken)

// 测试接口
router.get('/test', (ctx) => {
  console.log('vote test success')
  ctx.body = {
    suc: 'test',
  }
})

// 创建投票接口
router.post('/createVote', async (ctx) => {
  console.log('createVote接口')
  const newVote = new Vote(ctx.request.body)

  try {
    const result = await newVote.save()
    ctx.body = {
      message: '保存成功',
      result,
    }
  } catch (error) {
    console.error(error)
  }
})

// 删除投票接口
router.delete('/deleteVote', async (ctx) => {
  console.log('deleteVote connect')
  const voteId = ctx.request.body.voteId
  console.log(voteId)
  try {
    const res = await Vote.deleteOne({
      _id: voteId,
    })
    if (res.deletedCount) {
      ctx.body = {
        res,
        msg: 'delete suc',
      }
    }
  } catch (error) {
    console.error(error)
  }
})

// 获取投票详情接口
router.get('/getVoteDetail', async (ctx) => {
  console.log('获取投票详情接口')
  const { voteId, openId } = ctx.request.query
  const voteDetail: any = await Vote.findOne({ _id: voteId })
  const beforeVote = checkUserVote(voteDetail.voteOptionList, openId)
  ctx.body = { voteDetail, beforeVote }
})

// 提交投票选项接口
router.post('/submitVote', async (ctx) => {
  console.log('submitVote suc')
  const { optionId, openId, voteId, userInfo } = ctx.request.body
  await Vote.update(
    {
      _id: voteId,
    },
    {
      $inc: { votersCount: 1 },
    }
  )
  await Vote.update(
    { _id: voteId, 'voteOptionList._id': optionId },
    {
      $push: {
        'voteOptionList.$.supporters': Object.assign({ openId }, userInfo),
      },
      $inc: { 'voteOptionList.$.count': 1 },
    }
  )
  const res = await Vote.findOne({
    _id: voteId,
  })
  ctx.body = { msg: '提交投票成功', voteData: res }
})

// 获取投票占比接口
router.post('/getRetio', async (ctx) => {
  console.log('getRetio suc')
  const voteId = ctx.request.body.voteId
  const voteDetail: any = await Vote.findOne({ _id: voteId })
  const ratioList = getRetio(voteDetail.voteOptionList)
  ctx.body = {
    ratioList,
  }
})

// 获取投票列表接口

router.get('/getVoteList', async (ctx) => {
  console.log('getVoteList suc')
  const openId = ctx.request.query.openId
  try {
    const user: any = await User.findOne({ openId })
    const res: any = await Vote.find({ openId }).sort({ createTime: -1 })
    const voteList = res.map((item: any) => {
      const beforeVote = checkUserVote(item.voteOptionList, openId)
      return {
        voteData: item,
        userInfo: user.userInfo,
        beforeVote,
      }
    })
    ctx.body = {
      voteList,
    }
  } catch (error) {
    console.error(error)
  }
})

// 获取热门投票列表接口
router.get('/getHotVoteList', async (ctx) => {
  console.log('getHotVoteList suc')
  const openId = ctx.request.query.openId
  try {
    const user: any = await User.findOne({ openId })
    const res: any = await Vote.find({
      isPrivate: false,
      // endingTime: { $gt: new Date().valueOf() },
    }).sort({
      votersCount: -1,
    })
    const voteList = res.map((item: any) => {
      const beforeVote = checkUserVote(item.voteOptionList, openId)
      return {
        voteData: item,
        userInfo: user.userInfo,
        beforeVote,
      }
    })
    ctx.body = {
      voteList,
    }
  } catch (error) {
    console.error(error)
  }
})

// 获取数据汇总接口
router.get('/getVoteAnalysis', async (ctx) => {
  console.log('getVoteAnalysis connect')
  const voteId = ctx.request.query.voteId
  try {
    const voteData = await Vote.findOne({
      _id: voteId,
    })
    const detailData = getVoteAnalysis(voteData)
    ctx.body = {
      detailData,
    }
  } catch (error) {
    console.error(error)
  }
})

export const voteRouter = router.routes()
