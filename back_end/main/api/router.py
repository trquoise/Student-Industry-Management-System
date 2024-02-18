from . import api_database, api_user, api_industry_project, api_user_portfolio, \
    api_tags, api_project_application, api_milestone, api_recommendation, api_project_forum

routes = [
    {
        "path": "/resetDB",
        "comment": "Initialize Database",
        "component": api_database.resetDBView
    },
    {
        "path": "/login",
        "comment": "Login User",
        "component": api_user.userLoginView
    },
    {
        "path": "/register",
        "comment": "Register User",
        "component": api_user.userRegisterView
    },
    {
        "path": "/generateEmailCode",
        "comment": "Send Random Code",
        "component": api_user.generateEmailRandomCodeView
    },
    {
        "path": "/logout",
        "comment": "Logout User",
        "component": api_user.logoutView
    },
    {
        "path": "/accountDetail",
        "comment": "Get Account Detail",
        "component": api_user.accountDetailView
    },
    {
        "path": "/project",
        "comment": "Industry partner post new project",
        "component": api_industry_project.projectView
    },
    {
        "path": "/personalInfo",
        "comment": "all type users post persdnal info ",
        "component": api_user_portfolio.personalInfoView
    },
    {
        "path": "/userEducation",
        "comment": "User education information",
        "component": api_user_portfolio.userEducationInfoView
    },
    {
        "path": "/userProjectExperience",
        "comment": "User project experience",
        "component": api_user_portfolio.userProjectExperienceView
    },
    {
        "path": "/studentResume",
        "comment": "User project experience",
        "component": api_user_portfolio.studentResumeView
    },
    {
        "path": "/company",
        "comment": " post new company ",
        "component": api_user_portfolio.companyView
    },
    {
        "path": "/companyIntro",
        "comment": " post company summery ",
        "component": api_user_portfolio.companySummrayView
    },
    {
        "path": "/userTags",
        "comment": "tags for projects",
        "component": api_tags.userTagsView
    },
    {
        "path": "/projectApplication",
        "comment": "application of projects",
        "component": api_project_application.ProjectApplicationView
    },
    {
        "path": "/milestones",
        "comment": "milestones of projects",
        "component": api_milestone.MileStoneView
    },
    {
        "path": "/projectfeedback",
        "comment": "milestones feedback of projects",
        "component": api_industry_project.ProjectFeedBackView
    },
    {
        "path": "/currentproject",
        "comment": "current involved projects",
        "component": api_project_application.CurrentProjectView
    },
    {
        "path": "/currentprojectdetail",
        "comment": "current involved projects",
        "component": api_project_application.CurrentProjectDetailView
    },
    {
        "path": "/recommandateresearchers",
        "comment": "recommended 3 most suitable researchers ",
        "component": api_recommendation.Recommendate_Researcher_View
    },
    {
        "path": "/projectforum",
        "comment": "Project forum list",
        "component": api_project_forum.ProjectForumView
    },
    {
        "path": "/projectforum/<project_id>/<post_id>",
        "comment": "Project forum list",
        "component": api_project_forum.ProjectForumPostView
    },
    {
        "path": "/recommandateprojects",
        "comment": "reccomendation 3 most suitable projects",
        "component": api_recommendation.Recommendate_Project_View
    },
    {
        "path": "/projectinvitation",
        "comment": "Invite user apply projects",
        "component": api_industry_project.ProjectInvitationView
    },
    {
        "path": "/useravatar",
        "comment": "Get user avatar",
        "component": api_user_portfolio.PersonAvatar
    },
    {
        "path": "/recommandatestudents",
        "comment": "reccomendation 3 most suitable students",
        "component": api_recommendation.Recommendate_Student_View
    }
]
