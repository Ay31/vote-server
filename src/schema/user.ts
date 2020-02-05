import mongoose from 'mongoose'
const Schema = mongoose.Schema

const UserSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  encryptedData: {
    type: Object,
    required: true
  }
})

export const User = mongoose.model('user', UserSchema)
