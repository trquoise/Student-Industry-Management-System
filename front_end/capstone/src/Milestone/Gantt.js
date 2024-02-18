import React, { Component } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import './Gantt.css';
import { Button } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { post } from '../AxiosInstance/axiosController';



export default class Gantt extends Component {

    constructor(props) {
      super(props);
      this.state = {project_id : ''}
    }
    state = {project_id : ''}


    componentDidMount() {
        gantt.config.date_format = "%Y-%m-%d %H:%i";
        const { tasks, project_id } = this.props;
        gantt.init(this.ganttContainer);
        gantt.parse(tasks);
        console.log(project_id)
        this.setState({project_id: project_id})
    }

    handldSumbit(project_id) {
      const serialize_data = gantt.copy(gantt.serialize());
      console.log(typeof serialize_data)
      const temp = serialize_data.data.filter(item=> item.parent === 0)
      const milestones = temp.map((item) => {
        return {id: item.id, name: item.text}
      })
      const milestone = {
        data : serialize_data,
        project_id: project_id,
        milestones: milestones
      }
      post('/api/milestones', {data: milestone}).then((response)=> {
        if (response.status === 200) {
          console.log("success")
          alert('Milestone is uploaded')
        } else {
            console.log('wrong')
        }
      })

    }

    render() {
       return (
           <>
            <div
                ref={ (input) => { this.ganttContainer = input } }
                style={ { width: '100%', height: '100%' } }

            >
            </div>
            <Button onClick = {() => {
              this.handldSumbit(this.props.project_id)
            }}>Submit</Button>
           </>
       );
    }
}
