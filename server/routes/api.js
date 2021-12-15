const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Job = require('../models/job');
const Interview = require('../models/interview')
const date = require('date-and-time');

router.get('/user/:email', function (req, res) {
    const email = req.params.email
    User.find(({ email: email }), function (err, user) {
        res.send(user)
    })
})

router.get('/usersNotYetBeenInterviewed', function (req, res){
   

User.find()
    .populate({
         path    : 'job',
         populate: [
             { path: 'interviews' }
         ]
    }).exec(function (err, user) {
        console.log(user)
        let SimulationInterviewData = [];
        for(let i =0 ; i <= user.length ; i++){
            for(let j =0 ; j <= user[i].job.length ; j++){
                for(let k =0 ; k <= user[i].job[j].interviews.length ; k++){
                    if(user[i].job[j].interviews[k]._doc.scheduledSimulationInterview == false && user[i].email != "admin"){
                        
                        const obj = {
                            userEmail : user[i].email ,
                            interniewId : user[0].job[0].interviews[0]._doc._id,
                            userFirstName : user[i].firstName ,
                            userLastName : user[i].lastName ,
                            companyName : user[i].job[j].CompanyName ,
                            interViewType : user[0].job[0].interviews[0]._doc.interviewType
                        }
                        SimulationInterviewData.push(obj);
                    }
                }
            }
        }
    
        res.send(SimulationInterviewData)
    })
  
})

router.get('/users', function (req, res){
    User.find(({}), function (err, users) {
        res.send(users)
    })
})

function createArrayToViewAdminTable(user){
    let users =[]
    let contUsersIsEmployee =0;
    let contUsersIsNotEmployee =0;
    let StudentsWithOpenProcesses=0
    for(let i=0 ; i < user.length ; i++){

        for(let j=0 ; j < user[i].job.length ; j++){
           
            if(user[i].firstName != "admin")
            obj = {
                firstName : user[i].firstName , 
                lastName :  user[i].lastName ,
                email : user[i].email ,
                status :    user[i].status ,
                cycle :     user[i].cycle ,
                companyName :user[i].job[j]._doc.CompanyName ,
                interviewType :   user[i].job[j].interviews[0]._doc.interviewType
            }
            users.push(obj);
        }
        
    }
    for(let i=0 ; i < user.length ; i++){
        
        if(user[i].firstName != "admin"){
            if(user[i].status == "Employee"){
                contUsersIsEmployee++;
            }else{
                contUsersIsNotEmployee++;
            }
            for(let j=0 ; j < user[i].job.length ; j++){
            /*   
                if(user[i].job[j].isActive == "true"){
                    StudentsWithOpenProcesses++;
                    break;
                }
            */
            }
        }
    }
    StatisticsObj = { 
        studentsAmount : user.length ,
        contUsersIsEmployee : contUsersIsEmployee ,
        contUsersIsNotEmployee : contUsersIsNotEmployee,
        StudentsWithOpenProcesses :StudentsWithOpenProcesses,
        StudentsWithoutOpenProcesses : contUsersIsEmployee - StudentsWithOpenProcesses
    }

    users.push(StatisticsObj);
    return users
}

router.get('/users/:status/:cycle', function (req, res){
    const status = req.params.status
    const cycle = req.params.cycle
    if(status == "ALL" && cycle == "ALL"){

        User.find({ })
        .populate({
            path    : 'job',
            populate: [
                { path: 'interviews' }
            ]
       })
        .exec(function (err, user) {
            const users = createArrayToViewAdminTable(user)
            res.send(users)
        })
        
    }else if(cycle == "ALL"){
        User.find({ status: status})
        .populate({
            path    : 'job',
            populate: [
                { path: 'interviews' }
            ]
       })
        .exec(function (err, user) {
            const users = createArrayToViewAdminTable(user)
            res.send(users)
        })

    } else if(status == "ALL"){
        User.find({ cycle: cycle})
        .populate({
            path    : 'job',
            populate: [
                { path: 'interviews' }
            ]
       })
        .exec(function (err, user) {
            const users = createArrayToViewAdminTable(user)
            res.send(users)
        })

    }else {
       
        User.find({ status: status, cycle: cycle})
        .populate({
            path    : 'job',
            populate: [
                { path: 'interviews' }
            ]
       })
        .exec(function (err, user) {
            const users = createArrayToViewAdminTable(user)
            res.send(users)
        })     
    }
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
        isAdmin : false

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
    const now = new Date();
    let interview = new Interview({
        id: req.body.id,
        interviewType: req.body.interviewType,
        interviewDate:  req.body.interviewDate ,
        interviewerName: req.body.interviewerName,
        interviewDateCreated : date.format(now, 'YYYY/MM/DD HH:mm:ss') ,
        scheduledSimulationInterview : false
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

router.post('/editinterview', function (req,res) {
    Interview.updateOne(
        {_id: req.body.id},
        {isPassed : req.body.isPassed } , function(err,affected,resp){
         // console.log(err);
        }
        );
})

module.exports = router
