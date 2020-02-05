import mongoose from 'mongoose'
const Schema = mongoose.Schema

const tokenSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  encryptedData: {
    type: String,
    required: true
  },
  iv: {
    type: String,
    required: true
  }
})

export const Token = mongoose.model('user', tokenSchema)
