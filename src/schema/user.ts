import mongoose from 'mongoose'
const Schema = mongoose.Schema

const UserSchema = new Schema({
  openId: {
    type: String,
    required: true
  },
  userInfo: {
    type: Object,
    required: true
  }
})

export const User = mongoose.model('user', UserSchema)
