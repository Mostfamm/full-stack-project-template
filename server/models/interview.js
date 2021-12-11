const mongoose = require('mongoose')
const Schema = mongoose.Schema

const interviewSchema = new Schema({
    interviewType: String,
    interviewDate: Date,
    interviewerName: String,
})

const Interview = mongoose.model("interview", interviewSchema)
module.exports = Interview

