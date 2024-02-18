import React from 'react'
import Header from '../ProtoTemplate/Header'
import './projectDetail.css'
import { get } from '../AxiosInstance/axiosController';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProjectDetail = () => {

  const [details, setDetails] = React.useState({});
  const param = useParams()
  React.useEffect(() => {
    axios.get('/api/project?project_id='+ param.project_id).then((response) => {
        if (response.status == 200) {
            console.log(response.data)
            const target = response.data.filter((item) => {
                if (item.id == Number(param.project_id)) {
                    return item
                }
            })
            setDetails(target[0])
        } else {
            console.log("error")
        }
    })
  }, [])
  return (
    <>
        <Header/>
        {
            details != null ?
            <div className='container center flex project-detail'>
                <div className='project-detail-img'>
                    <img src="/asset/images/project.png" style={{width: '1200px', height: '675px'}}/>
                </div>
                <h1 style={{marginTop: '10%', fontWeight: '1000', marginBottom: '5%'}}>{details.name}</h1>
                <div className='project-detail-grid flex'>
                    <div className='left'>
                        <h4><strong>Owner: </strong>{details.owner}</h4>
                    </div>
                    <div className='right'>
                        <h4><strong>Period: </strong>{details.project_start_date} - {details.project_end_date}</h4>
                    </div>
                </div>
                <div className='project-detail-introduction'>
                    <h2><strong>Introduction</strong></h2>
                    <p>{details.brief_problem_statement}</p>
                </div>

                <div className='project-detail-requirements'>
                    <h2><strong>Requirenments</strong></h2>
                    <p>{details.required_skills}</p>
                </div>

            </div>
            :
            <div className='container center flex project-detail'>
                <h1>No project currently</h1>
            </div>
        }
    </>
  )
}

export default ProjectDetail
