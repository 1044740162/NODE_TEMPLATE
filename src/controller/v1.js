const Router = require('koa-router');

const router = new Router({
    prefix: '/v1'
})

router.get('/', ctx => {
    ctx.body = 'SUCCESS'
})

module.exports = router;