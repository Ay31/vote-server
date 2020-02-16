import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userInfoSchema = new mongoose.Schema({
  openId: String,
  nickName: String,
  gender: Number,
  language: String,
  city: String,
  province: String,
  country: String,
  avatarUrl: String,
})

const VoteSchema = new Schema({
  scores: Array,
  openId: {
    type: String,
    required: true,
  },
  voteTitle: {
    type: String,
    required: true,
  },
  createTime: {
    type: Date,
    required: true,
  },
  endingTime: {
    type: Date,
    required: true,
  },
  desTextareaData: {
    type: String,
  },
  enable: {
    type: Boolean,
  },
  isPrivate: {
    type: Boolean,
    required: true,
  },
  voteOptionList: [
    {
      content: String,
      count: Number,
      supporters: [userInfoSchema],
    },
  ],
})

export const Vote = mongoose.model('vote', VoteSchema)
