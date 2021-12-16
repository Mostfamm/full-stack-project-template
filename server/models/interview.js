const mongoose = require('mongoose')
const Schema = mongoose.Schema

    const interviewSchema = new Schema({
        interviewType: String, //enum
        interviewDateCreated : Date ,
        scheduledSimulationInterview : Boolean  ,
        interviewDate: String,
        interviewerName: String,
        isPassed: {    
            type: Boolean,
        default: null },
        status :{ type: String,
        enum : ['schuling' , 'pass' , 'fail' , 'pading'],
        default: 'schuling'},
        jobId : String
})

const Interview = mongoose.model("interview", interviewSchema)
module.exports = Interview

