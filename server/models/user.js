const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName : String,
    lastName  : String,
    email     : String,
    status    : String,
    cycle     : String,
    mobileNo  : String,
    password  : String,
    isAdmin   : Boolean,
    job: [{type: Schema.Types.ObjectId, ref: 'job'}] 
})

const User = mongoose.model("user", userSchema)
module.exports = User

