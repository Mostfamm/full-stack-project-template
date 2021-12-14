const mongoose = require('mongoose')
const Schema = mongoose.Schema

const jobSchema = new Schema({
    CompanyName : String,
    JobTitle  : String,
    Location    : String,
    gotJob     : String, //enum
    interviews : [{type: Schema.Types.ObjectId, ref: 'interview'}]
})

const Job = mongoose.model("job", jobSchema)
module.exports = Job

