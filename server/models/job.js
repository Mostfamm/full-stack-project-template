const mongoose = require('mongoose')
const Schema = mongoose.Schema

const jobSchema = new Schema({
    CompanyName : String,
    JobTitle  : String,
    Location    : String,
    gotJob     : String
})

const Job = mongoose.model("job", jobSchema)
module.exports = Job

