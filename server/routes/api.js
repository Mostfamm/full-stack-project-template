const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Job = require('../models/job');
const Interview = require('../models/interview')
const date = require('date-and-time');
const nodemailer = require("nodemailer");




router.get('/user/:email', function (req, res) {
    const email = req.params.email
    req.session.email="aaa"
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

router.get('/users', function (req, res) {
    User.find(({}), function (err, users) {
        res.send(users)
    })
})

function createArrayToViewAdminTable(user ,interViewStatus){
    let users =[]
    let contUsersIsEmployee =0;
    let contUsersIsNotEmployee =0;
    let StudentsWithOpenProcesses=0
    let StudentsWithoutOpenProcesses = 0
    let contUsersIsEmployeeInPercent =0;
    let contUsersIsNotEmployeeInPercent =0;
    let StudentsWithOpenProcessesInPercent=0
    let StudentsWithoutOpenProcessesInPercent = 0
    let userLength = 0;
    
     
    
    for(let i=0 ; i < user.length ; i++){

        for(let j=0 ; j < user[i].job.length ; j++){
           
            if(user[i].firstName != "admin")
            
            for(let k=0 ; k < user[i].job[j].interviews.length ; k++){
                if(user[i].job[j].interviews.length > 0){
                
                

                        if(user[i].job[j].interviews[k]._doc.status == interViewStatus || interViewStatus =="ALL")
                        {

                            let status  
                            if(user[i].job[j].interviews[k]._doc.status == 'pass'){
                                status = "pass"
                            }else if(user[i].job[j].interviews[k]._doc.status == 'fail'){
                                status = "fail"
                            }else if(user[i].job[j].interviews[k]._doc.status == 'schuling'){
                                status = "schuling"
                            }else if(user[i].job[j].interviews[k]._doc.status == 'pading'){
                                status = "pading"
                            }

                            obj = {
                                firstName : user[i].firstName , 
                                lastName :  user[i].lastName ,
                                email : user[i].email ,
                                interViewDate : user[i].job[j].interviews[k]._doc.interviewDate ,
                                interViewStatus : status ,
                                status :    user[i].status ,
                                cycle :     user[i].cycle ,
                                companyName :user[i].job[j]._doc.CompanyName ,
                                interviewType :   user[i].job[j].interviews[k]._doc.interviewType
                            }
                            users.push(obj);
                        }
                    
                }else{
                    if(user[i].job[j].interviews[k]._doc.status == interViewStatus || interViewStatus =="ALL")
                    {
                        obj = {
                            firstName : user[i].firstName , 
                            lastName :  user[i].lastName ,
                            email : user[i].email ,
                            isPassed : " / " ,
                            interViewDate : " / " ,
                            interViewStatus : "schuling" ,
                            status :    user[i].status ,
                            cycle :     user[i].cycle ,
                            companyName :user[i].job[j]._doc.CompanyName ,
                            interviewType :   "No interviews"
                        }
                        users.push(obj);
                    }
                }
            }
        }
        
    }
    let tempuser = [];
    for(let i = 0 ; i < user.length ; i++){
        for(let j=0; j<users.length;j++){
            if(user[i].email ==users[j].email)
            {
            tempuser.push(user[i]);
            break;
            }
        }
    }
    for (let index = 0; index < tempuser.length; index++) {
        if(tempuser[index].firstName == "admin"){
            userLength = tempuser.length-1;
            break;
        }
        if (index == tempuser.length-1){
            userLength = tempuser.length
        }
    }
    for(let i=0 ; i < tempuser.length ; i++){
        
        if(tempuser[i].firstName != "admin"){
            if(tempuser[i].status == "Employee"){
                contUsersIsEmployee++;
            }else{
                contUsersIsNotEmployee++;
            }
            for(let j=0 ; j < tempuser[i].job.length ; j++){
               
                if(tempuser[i].job[j].isActive && tempuser[i].status != "Employee"){
                    StudentsWithOpenProcesses++;
                    break;
                }
            
            }
            StudentsWithoutOpenProcesses = userLength -  StudentsWithOpenProcesses -contUsersIsEmployee

     
            }
            contUsersIsEmployeeInPercent =parseInt((contUsersIsEmployee/(userLength)*100).toFixed(2))
            contUsersIsNotEmployeeInPercent =parseInt((contUsersIsNotEmployee/(userLength)*100).toFixed(2))
            StudentsWithOpenProcessesInPercent=parseInt((StudentsWithOpenProcesses/contUsersIsNotEmployee*100).toFixed(2))
            StudentsWithoutOpenProcessesInPercent =parseInt((StudentsWithoutOpenProcesses/contUsersIsNotEmployee*100).toFixed(2))

            StatisticsObj = { 
                studentsAmount : userLength ,
                contUsersIsEmployee : contUsersIsEmployee ,
                contUsersIsNotEmployee : contUsersIsNotEmployee ,
                StudentsWithOpenProcesses :StudentsWithOpenProcesses ,
                StudentsWithoutOpenProcesses : StudentsWithoutOpenProcesses ,
                contUsersIsEmployeeInPercent : contUsersIsEmployeeInPercent,
                contUsersIsNotEmployeeInPercent : contUsersIsNotEmployeeInPercent ,
                StudentsWithOpenProcessesInPercent : StudentsWithOpenProcessesInPercent ,
                StudentsWithoutOpenProcessesInPercent : StudentsWithoutOpenProcessesInPercent
            }
        }
    users.push(StatisticsObj);
    return users
}

router.get('/users/:userStatus/:cohort/:interViewStatus', function (req, res){
    const userStatus = req.params.userStatus
    const cohort = req.params.cohort
    const interViewStatus = req.params.interViewStatus
    if(userStatus == "ALL" && cohort == "ALL"){

        User.find({ })
        .populate({
            path    : 'job',
            populate: [
                { path: 'interviews' }
            ]
       })
        .exec(function (err, user) {
           
                const users = createArrayToViewAdminTable(user , interViewStatus)
                res.send(users)
    
           
        })
        
    }else if(cohort == "ALL"){
        User.find({ status: userStatus})
        .populate({
            path    : 'job',
            populate: [
                { path: 'interviews' }
            ]
       })
        .exec(function (err, user) {
                          
               
                const users = createArrayToViewAdminTable(user ,interViewStatus)
                res.send(users)
        })

    } else if(userStatus == "ALL"){
        User.find({ cycle: cohort})
        .populate({
            path    : 'job',
            populate: [
                { path: 'interviews' }
            ]
       })
        .exec(function (err, user) {
            const users = createArrayToViewAdminTable(user ,interViewStatus)
            res.send(users)
        })

    }else {
       
        User.find({ status: userStatus, cycle: cohort})
        .populate({
            path    : 'job',
            populate: [
                { path: 'interviews' }
            ]
       })
        .exec(function (err, user) {
            const users = createArrayToViewAdminTable(user ,interViewStatus)
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
    })
    job.save()
    res.send(job)
})


router.get('/job/:email', function (req, res) {
    const email = req.params.email
    User.findOne({ email: email })
        .populate('job')
        .exec(function (err, user) {
            res.send(user.job)
        })

})


/****************************************************************************************** */

router.post('/interview', function (req, res) {
    const now = new Date();
    let interview = new Interview({
        jobId: req.body.id,
        interviewType: req.body.interviewType,
       interviewDate:  req.body.interviewDate,
     // interviewDate: date.format((new Date(req.body.interviewDate)),'YYYY'),
        interviewerName: req.body.interviewerName,
        interviewDateCreated : date.format(now, 'YYYY/MM/DD HH:mm:ss') ,
        scheduledSimulationInterview : false
    })

    Job.findByIdAndUpdate((req.body.id), { $push: { interviews: interview } }, function (err, interview) {
    })
    interview.save()
    res.send(interview)
})


router.get('/interview/:id', function (req, res) {
    const id = req.params.id
    Job.findOne({ _id: id })
        .populate('interviews')
        .exec(function (err, job) {
            res.send(job.interviews)
        })
})

router.post('/editinterview', async function (req, res) {
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let pased =req.body.isPassed+""
    let interviewType
    let jobId
    let CompanyName
    let status = req.body.status
    await Interview.updateOne(
        { _id: req.body.interviewId },
        { isPassed: req.body.isPassed ,status:status },
          (err, affected, resp) => {
            // console.log(err);
        }
    );
    
    if (pased == "true") { 
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
