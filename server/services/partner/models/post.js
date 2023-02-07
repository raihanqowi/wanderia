"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Post.belongsTo(models.Business, {
                foreignKey: "BusinessId",
                as: "business",
            });
        }
    }
    Post.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Name is Required",
                    },
                    notEmpty: {
                        msg: "Name is Required",
                    },
                },
            },
            imageUrl: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "image Url is Required",
                    },
                    notEmpty: {
                        msg: "image Url is Required",
                    },
                },
            },
            BusinessId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Business is Required",
                    },
                    notEmpty: {
                        msg: "Business is Required",
                    },
                },
            },
            link: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Link is Required",
                    },
                    notEmpty: {
                        msg: "Link is Required",
                    },
                },
            },
        },
        {
            sequelize,
            modelName: "Post",
        }
    );
    return Post;
};
