const mongoose = require('mongoose')
const Schema = mongoose.Schema

    const interviewSchema = new Schema({
        interviewType: String, //enum
        interviewDateCreated : Date ,
        scheduledSimulationInterview : Boolean  ,
        interviewDate: Date,
        interviewerName: String,
        isPassed: {
            type: Boolean,
        default: null
    },
})

const Interview = mongoose.model("interview", interviewSchema)
module.exports = Interview

