class Renderer {


    constructor(){
        this.sourceLogIn = $('#logIn-template').html()
        this.sourceRegister = $('#Register-template').html()
        this.templateLogIn = Handlebars.compile(this.sourceLogIn)
        this.templateRegister = Handlebars.compile(this.sourceRegister)
        this.sourceUser = $('#user-template').html()
        this.templateUser = Handlebars.compile(this.sourceUser)
        this.sourceAdmin = $('#admin-template').html()
        this.templateAdmin = Handlebars.compile(this.sourceAdmin)

        this.sourceAdminStatistics = $('#adminStatistics-template').html()
        this.templateAdminStatistics = Handlebars.compile(this.sourceAdminStatistics)

        this.element = $(".logIn-Register");
        this.elementUser =  $(".userInterview");
        this.elementAdmin = $(".admin")
        this.elementAdminStatistics = $(".admin")

    }

//    renderData (data) {
//        let source = $("#data-template").html(); 
//        let template = Handlebars.compile(source)
//        let html = template({results: results})
//        $(".results").empty().append(html)
//    }
    viewLogIn(){
        let someHTML = this.templateLogIn();
        this.element.append(someHTML);    
    }
    viewRegister(){
        let someHTML = this.templateRegister();
        this.element.append(someHTML);    
    }
    viewUser(jobs){
        let someHTML = this.templateUser({jobs});
        this.elementUser.append(someHTML);    
    }
    viewAdmin(users , Statistics){
        let someHTML = this.templateAdmin({users} );
        let someHTML1 = this.templateAdminStatistics({Statistics});
        this.elementAdminStatistics.append(someHTML1 ); 
        this.elementAdmin.append(someHTML  ); 

        
    }
    emptyView(){
        this.element.empty();
        this.elementUser.empty();
        this.elementAdmin.empty();
    }


}