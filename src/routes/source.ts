import Router from 'koa-router' // 导入koa-router
import fs from 'fs'
import path from 'path'

const router = new Router()

// 上传图片接口
router.post('/uploadImage', (ctx: any) => {
  console.log('uploadImg suc')
  console.log(ctx.request.files)
  const reader = fs.createReadStream(ctx.request.files['image']['path'])
  const stream = fs.createWriteStream(
    path.join('E:/source/upload/') + `/${ctx.request.files['image']['name']}`
  )
  reader.pipe(stream)
  ctx.body = {
    msg: 'ok',
    url: `E:/source/upload/${ctx.request.files['image']['name']}`,
  }
})

// 获取图片接口
router.get('/images/:url', async ctx => {
  console.log('images suc')
  ctx.status = 200
  const url = ctx.params.url
  const type = url.split('.')
  var imageFile = await new Promise(function(resolve, reject) {
    fs.readFile(`E:/source/upload/${url}`, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
  ctx.type = type[type.length - 1]
  ctx.body = imageFile
})
export const sourceRouter = router.routes()
