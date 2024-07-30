const jwt = require('jsonwebtoken')

module.exports = function(request, response, next) {
    try {
        const { authorization } = request.headers

        if(!authorization){
            return response.status(401).json('Unauthorized')
        }

        const token = authorization.replace('Bearer ', '').trim()
        const { isAdmin } = jwt.verify(token, process.env.SECRET_JWT)

        if(!isAdmin){
            return response.status(403).json('Token invalid')
        }

        return next()

    } catch(error){
        return response.status(401).send()
    }
}