const prisma = require('../database/prismaClient')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const login = async (request, response) => {
    try{
        const { email, password } = request.body
        
        const user = await prisma.user.findFirst({ where: { email } })

        if(!user){
            return response.status(401).json({ error: "Unauthorized 1" })
        }

        valid = bcrypt.compareSync(password, user.password)
        
        if(!valid){
            return response.status(401).json({ error: "Unauthorized 2" })
        }

        const token = jwt.sign({userId: user.id, user: user.name, isAdmin: user.isAdmin}, process.env.SECRET_JWT, { expiresIn: '3h' })

        return response.status(200).json({id: user.id, user: user.name, token: token})

    } catch(error){
        return response.status(500).json({ error: "Error" })
    }

}

module.exports = {
    login
}