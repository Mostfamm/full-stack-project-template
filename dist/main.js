const dataModel = new DataModel()
const renderer = new Renderer()
let jobId

loadPage =async function(){
    renderer.viewLogIn();
} 
$('.logIn-Register').on('click','.registerPage' , function() {
    renderer.emptyView();
    renderer.viewRegister();
})

$('.logIn-Register').on('click','.LogInbtn' , function() {
    renderer.emptyView();
    renderer.viewLogIn();
})


$('.logIn-Register').on('click','#Login' , async function() {
    const email = $(this).closest(".logInFormat").find("div").find("#email").val()
    const password = $(this).closest(".logInFormat").find("div").find("#password").val()
    await dataModel.userIsExist(email , password)
    if(dataModel.userData.length){
        alert("the user is exist")
//      window.location.href= "user.html";
        await dataModel.getJob();
        await dataModel.getInterview();
        renderer.emptyView();
        if(dataModel.userData[0].isAdmin){
            await dataModel.getAllUsers()
            renderer.viewAdmin(dataModel.users);
        }else{
            renderer.viewUser(dataModel.jobs); 
        }

    }else{
        alert("the user is not exist")
    }    
})  


$('.logIn-Register').on('click','#registerbtn' , async function() {
   
    const firstName = $(this).closest(".RegisterFormat").find("div").find("#firstName").val()
    const lastName = $(this).closest(".RegisterFormat").find("div").find("#lastName").val()
    const status = $(this).closest(".RegisterFormat").find("div").find("select")[0].value
    const cycle = $(this).closest(".RegisterFormat").find("div").find("select")[1].value
    const email = $(this).closest(".RegisterFormat").find("div").find("#email").val()
    const mobile = $(this).closest(".RegisterFormat").find("div").find("#mobile").val()
    const password = $(this).closest(".RegisterFormat").find("div").find("#password").val()
    
    if( firstName =="" ||lastName == "" ||  email =="" || mobile == "" || password ==""){
        alert("the inputs is require ")
    }
    else{
        await dataModel.emailIsExist(email);
        if(dataModel.userData.length){
            alert("the user is exist , pleace select different email")
        }else{
            await dataModel.saveUser(firstName , lastName , email , status , cycle , mobile , password)
            alert(" welcome to App !!!")
            renderer.emptyView();
            renderer.viewLogIn();    
        }
    }
})
$('.userInterview').on('click','#Apply' , async function() {
   
    const CompanyName = $(this).closest(".ApplyingNewJob").find("div").find("#CompanyName").val()
    const JobTitle = $(this).closest(".ApplyingNewJob").find("div").find("#JobTitle").val()
    const Location = $(this).closest(".ApplyingNewJob").find("div").find("#Location").val()
    const gotJob = $(this).closest(".ApplyingNewJob").find("div").find("select")[0].value
    if( CompanyName =="" ||JobTitle == "" ||  Location =="" || gotJob == "" ){
        alert("the inputs is require ")
    }
    else{
        await dataModel.saveJob(CompanyName , JobTitle , Location , gotJob);
        renderer.emptyView();
        
        renderer.viewUser(dataModel.jobs); 
    }
})
$('.userInterview').on('click','#ApplyInterview' , async function() {
   
    const interviewType = $(this).closest(".ApplyingNewJob").find("div").find("#interviewType").val()
    const interviewDate = $(this).closest(".ApplyingNewJob").find("div").find("#interviewDate").val()
    const interviewerName = $(this).closest(".ApplyingNewJob").find("div").find("#interviewerName").val()
    if( interviewType =="" ||interviewDate == "" ||  interviewerName ==""){
        alert("the inputs is require ")
    }
    else{
        await dataModel.saveInterview(jobId , interviewType , interviewDate , interviewerName);
        await dataModel.getInterview();
        renderer.emptyView();
        renderer.viewUser(dataModel.jobs); 
    }
    
 //  console.log($(this).parent().attr('id'));
})
$('.userInterview').on('click','.addNewInterview' , async function() {
   $(this).closest(".parent").find("div").find("#addJop").hide();
   $(this).closest(".parent").find("div").find("#addInterview").show();
   jobId=$(this).parent().attr('id'); 
      
})


$('.admin').on('click','#getUserData' , async function() {
    const status = $(this).closest(".FilterBy").find("div").find("select")[0].value
    const cycle = $(this).closest(".FilterBy").find("div").find("select")[1].value

    await dataModel.getUsers(status , cycle );
    renderer.emptyView();
    renderer.viewAdmin(dataModel.users);
})


loadPage();