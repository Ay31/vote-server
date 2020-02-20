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
  openId: {
    type: String,
    required: true,
  },
  voteTitle: {
    type: String,
    required: true,
  },
  createTime: {
    type: Number,
    required: true,
  },
  endingTime: {
    type: Number,
    required: true,
  },
  desTextareaData: {
    type: String,
  },
  imageList: Array,
  votersCount: Number,
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
  userInfo: Object,
})

export const Vote = mongoose.model('vote', VoteSchema)
