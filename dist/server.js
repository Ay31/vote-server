"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa")); // 导入koa
const koa_router_1 = __importDefault(require("koa-router")); // 导入koa-router
const mongoose_1 = __importDefault(require("mongoose"));
const app = new koa_1.default(); // 新建一个Koa对象
const router = new koa_router_1.default(); // 新建一个koa-router对象
mongoose_1.default.connect('mongodb://localhost/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.use(ctx => (ctx.response.body = 'Hello World'));
// router.get("/*", async ctx => {
//   // 截获所有路由,都指向此函数
//   ctx.body = "HALO123O WORLD"; // 向浏览器返回数据
// });
// app.use(router.routes()); // 使用路由
app.listen(8080); // 监听8080端口
console.log('Server running on http://localhost:8080');
//# sourceMappingURL=server.js.map