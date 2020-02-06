import mongoose from 'mongoose'
const Schema = mongoose.Schema

const VoteSchema = new Schema({
  openId: {
    type: String,
    required: true
  },
  voteTitle: {
    type: String,
    required: true
  },
  createTime: {
    type: Date,
    required: true
  },
  endingTime: {
    type: Date,
    required: true
  },
  desTextareaData: {
    type: String,
    // required: true
  },
  enable: {
    type: Boolean,
    required: true
  },
  isPrivate: {
    type: Boolean,
    required: true
  },
  voteOptionList: [
    {
      content: String,
      count: Number,
      supporters: [
        {
          userInfo: Object
        }
      ]
    }
  ]
})

export const Vote = mongoose.model('vote', VoteSchema)
