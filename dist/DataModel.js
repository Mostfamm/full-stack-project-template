class DataModel{
    constructor(){
        this.userData = {}
        this.jobs = []
    }

    getUsers = async function() {
        data =await  $.get(`/user`)
        console.log( data);
    }    
    
    userIsExist = async function(email , password) {
        let data =await  $.get(`/user/${password}/${email}`)
        this.userData = data
    }
    getUser =  function(email ) {
        this.userData =  $.get(`/user/${email}`)
    }  
    emailIsExist =  function(email ){
        this.userData =  $.get(`/user/${email}`)
        
    }
    saveUser = function(firstName , lastName , email , status , cycle , mobileNo , password) {
    
        $.post(`/user` , 
        { firstName : firstName , 
            lastName : lastName ,
            email : email ,
            status : status ,
            cycle : cycle,
            mobileNo : mobileNo ,
            password : password
        }) 
    }
    
    saveJob =async function(CompanyName , JobTitle , Location , gotJob){
        let job = await $.post(`/job` , 
        {
            CompanyName : CompanyName , 
            JobTitle : JobTitle ,
            Location : Location ,
            gotJob : gotJob ,
            id : this.userData[0]._id
        }) 
        this.jobs.push(job);
    }
    getJob  = async function(){
        let email = this.userData[0].email
        let job = await $.get(`/job/${email}`)
        this.jobs = [];
        for(let i=0; i< job.length ; i++){
        this.jobs.push(job[i])
        
        }
        
    }

}
