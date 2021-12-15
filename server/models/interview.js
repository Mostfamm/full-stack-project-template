const mongoose = require('mongoose')
const Schema = mongoose.Schema

const interviewSchema = new Schema({
    interviewType: String, //enum
    interviewDate: Date,
    interviewerName: String,
    isPassed: {
        type: Boolean,
        default: null
    },
    jobId : String
})

const Interview = mongoose.model("interview", interviewSchema)
module.exports = Interview

