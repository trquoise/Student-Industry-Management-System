import React, { Component } from 'react';
import Gantt from './Gantt';
import { Button } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { get } from '../AxiosInstance/axiosController';

const Milestone = () => {
    const data = {
        data: [
        ],
        links: [
        ]
    };

    const param = useParams()

    const [ganttData, setGanttData] = React.useState(null)

    React.useEffect(()=> {
        get('/api/milestones?project_id='+ param.project_id).then((response) => {
            if (response.status == 200) {
                if (response.data.code != 200) {
                    setGanttData({data})
                } else {
                    setGanttData(response.data.data)
                }
                console.log(response.data)
            }
        })
    }, [])


  return (
    <>
        {
            ganttData != null &&
            <div>
                <div className="gantt-container">
                    <Gantt tasks={ganttData} project_id = {param.project_id}/>
                </div>
            </div>
        }

    </>
  )
}

export default Milestone
