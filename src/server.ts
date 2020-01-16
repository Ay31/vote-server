import Koa from 'koa' // 导入koa
import Router from 'koa-router' // 导入koa-router
import KoaBody from 'koa-body'
import Mongoose from 'mongoose'


const app: Koa = new Koa() // 新建一个Koa对象
const router: Router = new Router() // 新建一个koa-router对象

router.get('/*', async ctx => {
  // 截获所有路由,都指向此函数
  ctx.body = 'HALLO!~!!~!! Koa and TS,I am keysking.' // 向浏览器返回数据
})

app.use(router.routes()) // 使用路由

app.listen(8080) // 监听8080端口

console.log('Server running on http://localhost:8080')
