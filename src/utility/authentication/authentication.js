//
// Authentication using JSON Web Token (JWT)
// Save this e.g. as ./util/auth/authentication.js
//
const settings = require('../../config/appconfig')
const moment = require('moment')
const jwt = require('jwt')

//
// Encode (from username to token)
//
function encodeToken(data) {
    const playload = {
        exp: moment().add(10, 'days').unix(),
        iat: moment().unix(),
        sub: ""   // can be any value or object you choose! 
    }
    return jwt.sign(playload, settings.secretKey)
}

//
// Decode (from token to username)
//
function decodeToken(token, callback) {

    try {
        const payload = jwt.decode(token, settings.secretKey)
        console.log(' payload:', payload)
        // Check if the token has expired.
        const now = moment().unix()
        if (now > payload.exp) {
            // console.log('Token has expired.')
            callback('Token has expired!', null)
        } else {
            callback(null, payload)
        }
    } catch (err) {
        console.log(' error in decoodetoken:', err)
        callback(err, null)
    }
}

module.exports = {
    encodeToken,
    decodeToken
}