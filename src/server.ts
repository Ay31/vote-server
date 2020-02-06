import Koa from 'koa' // 导入koa
import Router from 'koa-router' // 导入koa-router
import KoaBody from 'koa-body'
import mongoose from 'mongoose'

const app: Koa = new Koa() // 新建一个Koa对象
const router: Router = new Router() // 新建一个koa-router对象

mongoose
  .connect('mongodb://localhost/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('connect suc'))

app.use(
  KoaBody({
    json: true,
    urlencoded: true
  })
)

import { usersRouter } from './routes/users'
// import { tokenRouter } from './routes/users'
import { voteRouter } from './routes/vote'

router.use('/api/users', usersRouter)
router.use('/api/vote', voteRouter)

app.use(router.routes()).use(router.allowedMethods())

app.listen(8080) // 监听8080端口
