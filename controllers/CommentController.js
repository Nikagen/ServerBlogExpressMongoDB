import mongoose from "mongoose";
import CommentModel from "./../models/Comment.js";
import PostModel from "./../models/Post.js";

export const create = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.userId)
    const postId = req.params.id;
    const comment = {
      user: userId,
      text: req.body.text
    };
    const doc = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $push: {
          comments: comment
        }
      },
      {
        returnDocument: 'after',
      }
    );
    if (!doc) {
      return res.status(404).json({
        message: 'rjvvtyn не найдена',
      });
    }
  
    return res.status(200).json(doc);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось отправить комментарий',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const comments = await CommentModel.find().populate('user').exec();
    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить коментарии',
    });
  }
}
