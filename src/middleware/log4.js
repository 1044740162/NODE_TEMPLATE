const log4js = require('log4js')
const path = require('path')
const { getParams, getIp } = require('../common/index')
log4js.configure({
    appenders: {
        http: {
            type: 'dateFile', 
			pattern: '.yyyy-MM-dd.log',
			encoding: 'utf-8',
			alwaysIncludePattern: true,
			timeout: 20,
			"filename": path.resolve(__dirname, process.env.NODE_ENV === 'production' ? './logs/httpLog/http' : '../logs/httpLog/http'),
        }
    },
    categories: {
        default: {
            appenders: ['http'], 
            level: 'info'
        },
    }
})

const logger = {
    http: log4js.getLogger(),
    app: log4js.getLogger('app')
}

const isProd = process.env.NODE_ENV === 'production';

module.exports = async (ctx, next) => {
    ctx.logger = logger;
    ctx._ip = getIp(ctx);
    logger.http.info(JSON.stringify({
        type: 'receipt request',
        ip: ctx._ip,
        path: ctx.path,
        ...getParams(ctx),
    }))
    try {
        await next();
    } catch (error) {
        const { status=500, msg='', message } = error;
        if (!isProd) {
            console.log('code', status)
            console.log(msg)
            console.log(error)
        }
        ctx.status = status;
        ctx.body = {
            code: status,
            msg: msg || message
        };
    }
    if (typeof ctx.body === 'object' && !ctx.body.msg) {
        ctx.body.msg = ctx.body.code === 200 ? 'SUCCESS' : ''
    }
    const info = ctx.status === 200 ? logger.http.info : logger.http.error;
    info.call(logger.http, JSON.stringify({
        type: 'response end',
        http_status: ctx.status,
        ip: ctx._ip,
        response: ctx.body,
        path: ctx.path
    }))
}
