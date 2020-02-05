import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost/test')
console.log('db connect success')
mongoose.connection.on('disconnected', function() {
  console.log('db connect wrong')
})

export default mongoose
