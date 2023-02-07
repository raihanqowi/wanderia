const { Post, Business } = require("../models");

class PostControler {
    static async getAllPost(req, res, next) {
        try {
            const data = await Post.findAll();
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    static async createPost(req, res, next) {
        try {
            const { id } = req.params;
            const { name, imageUrl, link } = req.body;
            const dataPost = await Post.create({
                name,
                imageUrl,
                link,
                BusinessId: id,
            });
            res.status(201).json(dataPost);
        } catch (error) {
            next(error);
        }
    }

    static async deletePost(req, res, next) {
        try {
            const { id } = req.params;
            const dataPost = await Post.findByPk(id);
            if (!dataPost) {
                throw { name: "errorNotFound" };
            }
            await Post.destroy({ where: { id } });
            res.status(200).json({ message: "Success to Delete" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = PostControler;
