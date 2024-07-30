const jwt = require('jsonwebtoken')

module.exports = function(request, response, next) {
    try {
        const { authorization } = request.headers
        

        if(!authorization){
            return response.status(401).json('Unauthorized')
        }

        const token = authorization.replace('Bearer ', '').trim()
        const { userId } = jwt.verify(token, process.env.SECRET_JWT)

        if(!userId){
            return response.status(401).json('Token invalid')
        }

        request.userId = userId

        return next()

    } catch(error){
        return response.status(401).send()
    }
}