class DataModel {
    constructor() {
        this.userData = {}
        this.jobs = []
        this.interviews = []
    }

    getUsers = async function () {
        data = await $.get(`/user`)
        console.log(data);
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

}
