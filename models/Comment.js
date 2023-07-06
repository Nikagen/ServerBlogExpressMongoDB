import mongoose from "mongoose";

const CommentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  text: {
    type: String,
    required: true
  },
})

export default mongoose.model('Comment', CommentSchema);