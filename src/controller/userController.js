const prisma = require('../database/prismaClient')

const getAllUsers = async (request, response) => {
    try {
        const users = await prisma.user.findMany();
        response.status(200).json(users);
    } catch (error) {
        response.status(500).json({ error: 'Error fetching users', details: error.message });
    }
}

const createUser = async (request, response) => {
    try {
        const { name, email } = request.body;
        const user = await prisma.user.create({
            data: {
                name,
                email
            }
        });
        response.status(201).json(user);
    } catch (error) {
        response.status(500).json({ error: 'Error creating user', details: error.message });
    }
}

const updateUser = async (request, response) => {
    try {
        const { name, email } = request.body;
        const { id } = request.params;

        const user = await prisma.user.findFirst({
            where: { id }
        });

        if (user) {
            const updatedUser = await prisma.user.update({
                data: { name, email },
                where: { id }
            });
            response.status(200).json(updatedUser);
        } else {
            response.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        response.status(500).json({ error: 'Error updating user', details: error.message });
    }
}

const deleteUser = async (request, response) => {
    try {
        const { id } = request.params;

        const user = await prisma.user.findFirst({
            where: { id }
        });

        if (user) {
            await prisma.user.delete({
                where: { id }
            });
            response.status(204).send();
        } else {
            response.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        response.status(500).json({ error: 'Error deleting user', details: error.message });
    }
}

const createUserWithPosts = async (request, response) => {
    const { name, email, posts } = request.body;

    try {
        const result = await prisma.$transaction(async (prisma) => {
        const user = await prisma.user.create({
            data: {
                name,
                email,
            posts: {
                create: posts.map(post => ({
                    title: post.title,
                    content: post.content
                }))
            }
            },
            include: {
                posts: true
            }
        });

        return user;
        });

        response.status(201).json(result);
    } catch (error) {
        response.status(500).json({ error: 'Error creating user', details: error.message });
    }
  };

  const findUserById = async (request, response) => {
    try {
        const { startDate, endDate } = request.query;
        const { id } = request.params;

        const userFiltered = await prisma.user.findFirst({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
            posts: {
                where: {
                created: {
                    gte: startDate ? new Date(startDate) : undefined,
                    lte: endDate ? new Date(endDate) : undefined,
                },
                },
            },
            },
        });

        response.status(200).json(userFiltered)
    } catch (error) {
        response.status(500).json({ error: 'Error', details: error.message });
    }
  };

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    createUserWithPosts,
    findUserById
}
