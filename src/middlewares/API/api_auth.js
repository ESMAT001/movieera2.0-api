const { createHash, compareHash } = require('../../hash');
module.exports = async function (req, res, next) {
    let { api_key } = req.query;

    if (!api_key) api_key = req.headers['x-api-key'];

    if (!api_key) {
        return res.status(401).send({
            status: 401,
            message: 'API key is required'
        });
    }
    const User = global.db.user
    const user = await User.findUnique({
        where: { api_key: createHash(api_key, process.env.API_KEY_SALT) },
        include: { api_usage: true }
    });

    if (!user || !compareHash(api_key, process.env.API_KEY_SALT, user.api_key)) {
        return res.status(401).send({
            status: 401,
            message: 'API key is incorrect'
        });
    }
    console.log(user)
    if (user.api_usage.count >= process.env[`${user.account_type.toUpperCase()}_API_USAGE`]) {
        return res.status(429).send({
            status: 429,
            message: 'API key is exceeded'
        });
    }
    

    let data = {}
    if (user.api_usage.length > 0) {
        data = { api_usage: { create: { request_count: user.api_usage[user.api_usage.length - 1].request_count + 1 } } }
    } else {
        data = { api_usage: { create: { request_count: 1 } } }
    }

    await User.update({
        where: { id: user.id },
        data: data
    })

    console.log('rest', compareHash(api_key, process.env.API_KEY_SALT, user.api_key))
    next()
}