const prisma = require('../database/prismaClient');
const multer = require('multer');
const path = require('path');
const bucket = require('../config/firebase');

const upload = multer({ storage: multer.memoryStorage() });

const getAllPosts = async (request, response) => {
    try {
        const posts = await prisma.post.findMany();
        response.status(200).json(posts);
    } catch (error) {
        response.status(500).json({ error: 'Error fetching posts', details: error.message });
    }
}


const uploadImageToFirebase = async (file) => {
  const fileName = Date.now() + path.extname(file.originalname);
  const fileUpload = bucket.file(fileName);

  await fileUpload.save(file.buffer, {
    metadata: { contentType: file.mimetype },
  });

  const [url] = await fileUpload.getSignedUrl({
    action: 'read',
    expires: '03-09-2491',
  });

  return url;
}

const createPost = async (request, response) => {
    upload.single('image')(request, response, async (err) => {
        if (err) {
            return response.status(500).json({ error: 'Error uploading image', details: err.message });
        }

        try {
            const { title, content, userId } = request.body;
            const image = request.file ? await uploadImageToFirebase(request.file) : '';

            const post = await prisma.post.create({
                data: {
                    title,
                    content,
                    image,
                    user_id: userId
                }
            });
            response.status(201).json(post);
        } catch (error) {
            response.status(500).json({ error: 'Error creating post', details: error.message });
        }
    });
}

const updatePost = async (request, response) => {
    upload.single('image')(request, response, async (err) => {
        if (err) {
            return response.status(500).json({ error: 'Error uploading image', details: err.message });
        }

        try {
            const { title, content } = request.body;
            const { id } = request.params;
            const image = request.file ? await uploadImageToFirebase(request.file) : undefined;

            const postExist = await prisma.post.findUnique({
                where: {
                    id
                }
            });

            if (postExist) {
                const post = await prisma.post.update({
                    data: {
                        title, 
                        content,
                        image: image !== undefined ? image : postExist.image
                    },
                    where: {
                        id
                    }
                });
                response.status(200).json(post);
            } else {
                response.status(404).json({ error: 'Post not found' });
            }
        } catch (error) {
            response.status(500).json({ error: 'Error updating post', details: error.message });
        }
    });
}

const deletePost = async (request, response) => {
    try {
        const { id } = request.params;

        const postExist = await prisma.post.findUnique({
            where: {
                id
            }
        });

        if (postExist) {
            await prisma.post.delete({
                where: { id }
            });
            response.status(204).send();
        } else {
            response.status(404).json({ error: 'Post not found' });
        }
    } catch (error) {
        response.status(500).json({ error: 'Error deleting post', details: error.message });
    }
}

const getPostsByUser = async (request, response) => {
    try {
        const { userId } = request.params;
        const userWithPosts = await prisma.user.findUnique({
            where: { id: userId },
            include: { posts: true },
        });
        if (userWithPosts) {
            response.status(200).json(userWithPosts.posts);
        } else {
            response.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        response.status(500).json({ error: 'Error fetching posts for user', details: error.message });
    }
}

module.exports = {
    getAllPosts,
    createPost,
    updatePost,
    deletePost,
    getPostsByUser
}
