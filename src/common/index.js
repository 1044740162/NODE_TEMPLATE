exports.getParams = (ctx) => {
    if (!ctx) return {}
    const { query={}, request: { body={} }, params={} } = ctx;
    const param = JSON.parse(JSON.stringify({
        query,
        body,
        params
    }))
    if (param.body.passwd && process.env.NODE_ENV === 'production') {
        delete param.body.passwd
    }
    return param
}

exports.getIp = ({req}) => {
    const _ip = req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;
	return _ip.replace('::ffff:', '')
}