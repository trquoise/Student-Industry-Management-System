import { rest } from 'msw';


var data = {
  name: 'jinyuan',
  location: 'sydney',
  phone_number: '12314',
  introduction: 'hello world'
}

// var data = {}

var edus = {
  data : [{
    major:'Nutrition',
    degree:'Bachelor of Science',
    id: '1'
  }]

}
// var edus = {
//   data: []
// }

var projects = {
  data: [{
  project_name: 'Management platform',
  discipline: 'computer science',
  start_date: '2018-07-22',
  end_date: '2018-07-22',
  id: '1'
}]}

// var projects = {
//   data: []
// }

var company = {
  data : {
    "company_area": "123",
    "company_id": 1,
    "company_name": "123",
    "company_summary": ""
  }
}

var account = {
  data : {
    "username": "jinyuan",
    "email": "jinyuan@gamil.com"
  }
}

// var company = {
//   data: {}
// }

var companySum = {
  company_summary:'Hello'
}

// var companySum = {
//   company_summary:''
// }

var tags = {
  data: [

    { value: 'Angular', label: 'Angular' },
    { value: 'jQuery', label: 'jQuery' },
    { value: 'Polymer', label: 'Polymer' },
    { value: 'React', label: 'React' },
    { value: 'Vue.js', label: 'Vue.js' },
  ]
}

var Allprojects = {
  data: [{
      project_id: 1,
      project_name: "UNSW capstone",
      status: 'In progress',
    },
    {
      project_id: 2,
      project_name: "UNSW capstone1",
      status: 'In progress',
    }
  ],
  code: 200
}

var gantt = [{
  project_id: 1,
  data: {
    data: [
      { id: 1, text: 'Task #1', start_date: '2019-04-15', duration: 3, progress: 0.6 },
      // { id: 2, text: 'Task #2', start_date: '2019-04-18', duration: 3, progress: 0.4 }
    ],
    links: [
        { id: 1, source: 1, target: 2, type: '0' }
    ]
  }
}]

var project_detail = {
  project_name : "This is the project name",
  owner : "jinyuan",
  start_date : "01/01/2022",
  end_date : "01/11/2022",
  introduction: "orem ipsum dolor sit amet, eam sonet aperiri perpetua te, prima explicari quo ex. Vocent democritum sed ei. Vel ea consul invenire, at choro putant hendrerit vix. Assum aeque ea mel. Mel ne veri temporibus, id doming dictas consequuntur nec. Erant expetenda an nam. Movet impedit neglegentur duo et, utroque neglegentur concludaturque ex nam. Facete ornatus adipiscing sit ad, pro et semper deleniti voluptua. His ut alterum mnesarchum, persius labitur tacimates eum ei. Ea duo nusquam singulis interesset. Sit eu ferri choro libris. Saepe quando consetetur per in, cum no esse persecuti, ex assueverit mediocritatem sed. Cu diam scaevola interpretaris mei, sumo idque iisque mea ut, liber euripidis eam te. Qui te lorem erant noluisse, at saepe graece vis, has et reque noluisse comprehensam. Cu sed amet pericula, at delectus expetendis sit. Quando facete dolores ut ius, has ea erroribus concludaturque. Prima nihil latine ea mea, sit commune singulis at. Suscipit adipisci ex cum. Facilis atomorum deterruisset in pri. Postea ornatus ullamcorper ut est, ad paulo fierent eam, in diam noster propriae mel. Id nam modo consulatu disputationi. An mel omnis iusto. Vis volutpat praesent neglegentur at, ius ex suavitate consetetur. Veri ridens mei et, vim eros libris democritum in, ex admodum docendi qui. Pro cu nullam consectetuer, sea ex duis dicat.",
  requirements: "orem ipsum dolor sit amet, eam sonet aperiri perpetua te, prima explicari quo ex. Vocent democritum sed ei. Vel ea consul invenire, at choro putant hendrerit vix. Assum aeque ea mel. Mel ne veri temporibus, id doming dictas consequuntur nec. Erant expetenda an nam. Movet impedit neglegentur duo et, utroque neglegentur concludaturque ex nam. Facete ornatus adipiscing sit ad, pro et semper deleniti voluptua. His ut alterum mnesarchum, persius labitur tacimates eum ei. Ea duo nusquam singulis interesset. Sit eu ferri choro libris. Saepe quando consetetur per in, cum no esse persecuti, ex assueverit mediocritatem sed. Cu diam scaevola interpretaris mei, sumo idque iisque mea ut, liber euripidis eam te. Qui te lorem erant noluisse, at saepe graece vis, has et reque noluisse comprehensam. Cu sed amet pericula, at delectus expetendis sit. Quando facete dolores ut ius, has ea erroribus concludaturque. Prima nihil latine ea mea, sit commune singulis at. Suscipit adipisci ex cum. Facilis atomorum deterruisset in pri. Postea ornatus ullamcorper ut est, ad paulo fierent eam, in diam noster propriae mel. Id nam modo consulatu disputationi. An mel omnis iusto. Vis volutpat praesent neglegentur at, ius ex suavitate consetetur. Veri ridens mei et, vim eros libris democritum in, ex admodum docendi qui. Pro cu nullam consectetuer, sea ex duis dicat."
}

var resume = null

export const handlers = [

    rest.get('/getPersonalInfo', (req, res, ctx) => {
      return res(
        // Respond with a 200 status code
        ctx.status(200),
        ctx.json(data),
      )
    }),
    rest.get('/getEducationInfo', (req, res, ctx) => {
        console.log(ctx.json(edus))
        return res(
          // Respond with a 200 status code
          ctx.status(200),
          ctx.json(edus),
        )
      }),

    rest.get('/getCompanyInfo', (req, res, ctx) => {
    return res(
        // Respond with a 200 status code
        ctx.status(200),
        ctx.json(company),
    )
    }),
    rest.get('/getCompanySummary', (req, res, ctx) => {
        return res(
            // Respond with a 200 status code
            ctx.status(200),
            ctx.json(companySum),
        )
    }),

    rest.get('/getProjectExp', (req, res, ctx) => {
        return res(
          // Respond with a 200 status code
          ctx.status(200),
          ctx.json(projects),
        )
      }),

      rest.post('/userInfo', (req, res, ctx) => {
        data = req.body
        return res(
          ctx.status(200)
        )
      }),

      rest.post('/educationInfo', (req, res, ctx) => {
        edus = req.body
        console.log(edus)
        return res(
          ctx.status(200)
        )
      }),

      rest.post('/projectInfo', (req, res, ctx) => {
        projects = req.body
        console.log(projects)
        return res(
          ctx.status(200)
        )
      }),

      rest.post('/companyInfo', (req, res, ctx) => {
        company = req.body
        return res(
          ctx.status(200)
        )
      }),

      rest.post('/companySum', (req, res, ctx) => {
        companySum = req.body
        return res(
          ctx.status(200)
        )
      }),

      rest.get('/accountDetail', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(account),
        )
      }),

      rest.get('/tags', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(tags),
        )
      }),

      rest.post('/tags', (req, res, ctx) => {
        tags = req.body
        console.log(tags)
        return res(
          ctx.status(200),
          ctx.json(tags),
        )
      }),

      rest.post('/resume', (req, res, ctx) => {
        resume = req.body
        console.log(resume)
        return res(
          ctx.status(200),
        )
      }),

      rest.get('/projects', (req, res, ctx) => {
        return res(
          ctx.json(Allprojects),
          ctx.status(200),
        )
      }),

      rest.post('/gantt', (req, res, ctx) => {
        console.log(req.body)
        gantt = req.body
        console.log(gantt)
        return res(
          ctx.status(200),
        )
      }),

      rest.get('/gantt', (req, res, ctx) => {
        const param = req.url.href.split('?')[1].split('=')
        const project_id = param[1]
        console.log(project_id)
        const r = gantt[0].data
        // for (var i = 0; i < gantt.length; i++) {
        //   console.log('here')
        //   if(gantt[i].project_id == Number(project_id)) {
        //     r = gantt[i].data
        //   }
        // }
        console.log(gantt[0].data)
        return res(
          ctx.json(r),
          ctx.status(200)
        )
      }),

      rest.get('/projectDetail', (req, res, ctx) => {
        const param = req.url.href.split('?')[1].split('=')
        const project_id = param[1]
        console.log(project_id)
        const r = project_detail
        return res(
          ctx.json(r),
          ctx.status(200)
        )
      }),

  ]