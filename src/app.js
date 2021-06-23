const Koa = require('koa')
const koaBodyParser = require('koa-bodyparser')
const fs = require('fs')
const https = require('https')
// hook
const log4js = require('./middleware/log4')
const auth = require('./middleware/auth')
const router = require('./controller/v1')
const config = require('./config/index')
const app = new Koa();
app.use(koaBodyParser());
app.use(log4js);
app.use(auth);
app.use(router.routes());

if (process.env.NODE_ENV === 'production') {
    const param = {
        key: fs.readFileSync(config.sslKeyPath, 'ascii'),
        cert: fs.readFileSync(config.sslCertPath, 'ascii'),
        requestCert: false,
        rejectUnauthorized: false
    }
    https.createServer(param, app.callback()).listen(config.port, config.host, () => {
        console.log(`server listening on https://${config.host}:${config.port}`)
    })
} else {
    app.listen(config.port, () =>{
        console.log('server listening on http://localhost:' + config.port);
    })
}
