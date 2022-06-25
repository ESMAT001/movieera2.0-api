const crypto = require('crypto');

const createHash = (password, salt = "this is salt") => {
    return crypto.createHash('sha256').update(password + salt).digest('hex');
}

const compareHash = (password, salt, hash) => {
    return createHash(password, salt) === hash;
}

module.exports = {
    createHash,
    compareHash
}