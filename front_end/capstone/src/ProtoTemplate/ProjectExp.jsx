import React from 'react';
import axios from 'axios';
import './projectExp.css';
import InputField from './components/InputField';
import EditBtnProjectExp from '../ProtoTemplate/components/EditBtnProjectExp'
import {get} from '../AxiosInstance/axiosController'


const ProjectExp = () => {
  const fields_val = [
        {type: 'text', item: 'Project Name'},
        {type: 'text', item: 'Discipline'},
        {type: 'date', item: 'Start Date'},
        {type: 'date', item: 'End Date'},
  ]
  var contents = []

  const [projectExp, setProjectExp] = React.useState(null)

  const [newData, setNewData] = React.useState(null)

  React.useEffect(() => {
      get('/api/userProjectExperience').then((response) => {
          if (response.status === 200) {
            console.log(response.data)
            setProjectExp(response.data.data)
          } else {
              console.log('wrong')
          }
      })
  }, [newData]);

  if (projectExp != null) {
    if (projectExp.length == 0) {
      contents = ["", "", "", ""]
    }
    for (var i = 0; i < projectExp.length; i++) {
        console.log(projectExp[i])
        // todo transfer the start_date into correct style
        const dateFormat =/^(\d{2})-(\d{2})-(\d{4})$/;
        if (dateFormat.test(projectExp[i].start_date)) {
            const val = projectExp[i].start_date.split("-").reverse().join("-");
            console.log(val)
            projectExp[i].start_date = val
        }

        if (dateFormat.test(projectExp[i].end_date)) {
          const val = projectExp[i].end_date.split("-").reverse().join("-");
          console.log(val)
          projectExp[i].end_date = val
        }
        contents = [...contents, projectExp[i].project_name, projectExp[i].discipline, projectExp[i].start_date, projectExp[i].end_date]
        // contents = [...contents, ...Object.values(educaionInfo[i])]
    }
    console.log(contents)
}

  return (
    <div className="container flex project">
            <div className="projectinfo shadow">
                <div className="infotitle"><h3>Project Experience</h3></div>
                <div className='flex inputFields '>
                    {contents.map((element,index) => {
                        if (index % 4 == 0) {
                            return <InputField value = "text" key ={index} values = {fields_val[0]} content = {element}/>
                        }
                        if (index % 4 == 1){
                            return <InputField value = "text" key ={index} values = {fields_val[1]} content = {element}/>
                        }
                        if (index % 4 == 2){
                          return <InputField value = "text" key ={index} values = {fields_val[2]} content = {element}/>
                        }
                        if (index % 4 == 3){
                          return <InputField value = "text" key ={index} values = {fields_val[3]} content = {element}/>
                        }
                    })}
                 </div>
                 <EditBtnProjectExp setData = {setNewData}/>
            </div>




    </div>
  )
}

export default ProjectExp

