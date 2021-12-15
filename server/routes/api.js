const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Job = require('../models/job');
const Interview = require('../models/interview')
const nodemailer = require("nodemailer");
router.get('/user/:email', function (req, res) {
    const email = req.params.email
    User.find(({ email: email }), function (err, user) {
        res.send(user)
    })
})

//   $.get(`/users/${status}/${cycle}/${gotJob}/${companyName}`)


router.get('/users', function (req, res) {
    User.find(({}), function (err, users) {
        res.send(users)
    })
})
router.get('/users/:status/:cycle', function (req, res) {
    const status = req.params.status
    const cycle = req.params.cycle
    if (status == "ALL" && cycle == "ALL") {
        User.find(({}), function (err, users) {
            res.send(users)
        })
    } else if (cycle == "ALL") {
        User.find(({ status: status }), function (err, users) {
            res.send(users)
        })

    } else if (status == "ALL") {
        User.find(({ cycle: cycle }), function (err, users) {
            res.send(users)
        })
    } else {
        User.find(({ status: status, cycle: cycle }), function (err, users) {
            res.send(users)
        })
    }



    /* 
        User.find(( {
            $and: [
                { $or : [ {status : { $exists: false }}, {status : { status }}] } ,
                { $or : [ {cycle : { $exists: false }}, {cycle : { cycle }}] } 
            ]}
        ), function (err, users) {
            res.send(users)
        })
    */
})

router.get('/user/:password/:email', function (req, res) {
    const email = req.params.email
    const password = req.params.password
    User.find(({ email: email, password: password }), function (err, user) {
        res.send(user)
    })
})

router.post('/user', function (req, res) {

    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        status: req.body.status,
        cycle: req.body.cycle,
        mobileNo: req.body.mobileNo,
        password: req.body.password,
        isAdmin: false

    })
    user.save()
    res.send(user)
})

router.post('/job', function (req, res) {

    let job = new Job({
        CompanyName: req.body.CompanyName,
        JobTitle: req.body.JobTitle,
        Location: req.body.Location,
        gotJob: req.body.gotJob,
    })

    User.findByIdAndUpdate((req.body.id), { $push: { job: job } }, function (err, user) {
        console.log(user);
    })
    job.save()
    res.send(job)
})


router.get('/job/:email', function (req, res) {
    const email = req.params.email
    User.findOne({ email: email })
        .populate('job')
        .exec(function (err, user) {
            console.log(user)

            res.send(user.job)
        })

})


/****************************************************************************************** */

router.post('/interview', function (req, res) {

    let interview = new Interview({
        jobId: req.body.id,
        interviewType: req.body.interviewType,
        interviewDate: req.body.interviewDate,
        interviewerName: req.body.interviewerName,
    })

    Job.findByIdAndUpdate((req.body.id), { $push: { interviews: interview } }, function (err, interview) {
        console.log(interview);
    })
    interview.save()
    res.send(interview)
})


router.get('/interview/:id', function (req, res) {
    const id = req.params.id
    Job.findOne({ _id: id })
        .populate('interviews')
        .exec(function (err, job) {
            console.log(job)
            res.send(job.interviews)
        })
})

router.post('/editinterview', async function (req, res) {
    console.log(req.body.firstName);
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let pased =req.body.isPassed+""
    let interviewType
    let jobId
    let CompanyName
    await Interview.updateOne(
        { _id: req.body.interviewId },
        { isPassed: req.body.isPassed },  (err, affected, resp) => {
            // console.log(err);
        }
    );
    console.log(req.body.isPassed);
    if (pased == "true") { 
        
      //  console.log(req.body.interviewId);
        await Interview.findOne({ _id: req.body.interviewId }, async function (err, res) {
            interviewType = res.interviewType
            jobId = res.jobId 
            await  Job.findOne({ _id:jobId }, (err, res)=> {

                CompanyName = res.CompanyName
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'elevation744',
                        pass: 'Atedna4!@#'
                    }
                });
                let mailOptions = {
                    from: 'elevation744@gmail.com',
                    to: 'elevation744@gmail.com',
                    subject: 'another student pass interview',
                    text: firstName + " " + lastName + " passed "+interviewType+" interview in "+CompanyName
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                })
    
            }
            );            
        }
        
        );
       
   }else{
    await Interview.findOne({ _id: req.body.interviewId }, async function (err, res) {
        jobId = res.jobId 
        Job.findByIdAndUpdate((jobId), { isActive:false }, function (err, interview) {
           // console.log(interview);
        })
    })

   }
})



module.exports = router
