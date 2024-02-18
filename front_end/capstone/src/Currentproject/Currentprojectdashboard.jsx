import React from 'react';
import Header from '../ProtoTemplate/Header';
import './currentprojectdashboard.css';
import ProjectItem from './ProjectItem';
import { get } from '../AxiosInstance/axiosController';


const Currentprojectdashboard = () => {

    const [projects, setProjects] = React.useState([])

    React.useEffect(() => {

        get('/api/currentproject').then((response)=> {
            console.log(response)
          if (response.status === 200) {
            if (response.data.code == 200) {
                setProjects(response.data.data)
            }
          } else {
                console.log('wrong')
          }
        })
    }, []);


  return (
    <div>
        <div className='currentprojectdashboard'>
            <Header/>
        </div>
        <div className="currentprojecttitle"><h3>Current Project</h3></div>
        <div className='projectdashboard shadow'>
            {
                projects.length == 0 &&
                <h1 style={{textAlign: 'center'}}>No project currently</h1>
            }
            {
                projects.length > 0 &&
                <>
                    {projects.map((items, index)=> {
                        return <ProjectItem key = {index} index = {index + 1} project = {items}/>
                    })}
                </>
            }

        </div>

    </div>

  )
}

export default Currentprojectdashboard
