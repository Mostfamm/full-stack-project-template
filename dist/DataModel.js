class DataModel {
    constructor() {
        this.userData = {}
        this.jobs = []
        this.interviews = []
        this.users = []
        this.Statistics = {}
    }

    getUsersNotYetBeenInterviewed =async function(){
        const data = await $.get('/usersNotYetBeenInterviewed')
        console.log(data);
    }
    getAllUsers = async function () {
        let status = "ALL";
        let cycle = "ALL";
        const data =await  $.get(`/users/${status}/${cycle}`)
        this.Statistics = data.pop()
        this.users = data;
    }

    getUsers = async function (status , cycle ) {
        const data =await  $.get(`/users/${status}/${cycle}`)
        this.Statistics = data.pop()
        this.users = data;
    }

    userIsExist = async function (email, password) {
        let data = await $.get(`/user/${password}/${email}`)
        this.userData = data
    }
    getUser = function (email) {
        this.userData = $.get(`/user/${email}`)
    }
    emailIsExist = function (email) {
        this.userData = $.get(`/user/${email}`)

    }
    saveUser = function (firstName, lastName, email, status, cycle, mobileNo, password) {

        $.post(`/user`,
            {
                firstName: firstName,
                lastName: lastName,
                email: email,
                status: status,
                cycle: cycle,
                mobileNo: mobileNo,
                password: password
            })
    }

    saveJob = async function (CompanyName, JobTitle, Location, gotJob) {
        let job = await $.post(`/job`,
            {
                CompanyName: CompanyName,
                JobTitle: JobTitle,
                Location: Location,
                gotJob: gotJob,
                id: this.userData[0]._id
            })
        this.jobs.unshift(job);
    }
    getJob = async function () {
        let email = this.userData[0].email
        let job = await $.get(`/job/${email}`)
        this.jobs = [];
        for (let i = 0; i < job.length; i++) {
            this.jobs.unshift(job[i])

        }

    }
    /***************************************************************************************** */
    saveInterview = async function (id, interviewType, interviewDate, interviewerName) {
        let interview = await $.post(`/interview`,
            {
                id: id,
                interviewType: interviewType,
                interviewDate: interviewDate,
                interviewerName: interviewerName,

            })
        this.interviews.push(interview)
    }
    getInterview = async function () {
        for (let i = 0; i < this.jobs.length; i++) {
            let id = this.jobs[i]._id
            let interviews = await $.get(`/interview/${id}`)
            this.jobs[i].interviews = []
            for (let interview of interviews) {
                this.jobs[i].interviews.push(interview)
            }

        }

    }
    /****************************************************************************************************** */
    editInterview = async function (id, isPassed) {
        $.post(`/editinterview`,
            {
                id: id,
                isPassed: isPassed

            })
    }

}
