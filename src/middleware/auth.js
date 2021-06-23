const config = require('../config/index');

module.exports = async (ctx, next) => {
    if (process === 'production') {
        const _index = config.whiteList.findIndex(ip => ctx._ip === ip);
        if (_index === -1) {
            throw({ status: 401})
        } else {
           await next()
        }
    } else{
        await next()
    }
}