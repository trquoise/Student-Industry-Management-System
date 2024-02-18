import React from 'react';
import Header from '../../ProtoTemplate/Header';
import './studentfeedback.css'
import { useParams } from 'react-router-dom';
import { get } from '../../AxiosInstance/axiosController';
import { Rating } from '@mui/material';

const Studentfeedbackpage = () => {

  const param = useParams()

  const data = {
    milestones : [
        {
            name: "Task 1",
            id : 1,
            feedback: {
                content: "this is first milestone feedback",
                rate: "5",
                user_id: 1
            }
        },
        {
            name: "Task 2",
            id : 2,
            feedback: {
                content: "this is first milestone feedback",
                rate: "4",
                user_id: 1
            }
        }
    ]
  }

  const [feedbacks, setFeedBacks] = React.useState([])
  const [projectRate, setProjectRate] = React.useState(null)
//   const [projectFeedbacks, setProjectFeedbacks] = React.useState([])


  React.useEffect(() => {
    get('/api/projectfeedback?project_id=' + param.project_id).then((response)=> {
        console.log(response)
        if (response.status === 200) {
            if (response.data.code === 200) {
                const feeds = response.data.data
                const my_feedbacks = feeds.filter((item) => {
                    if (item.user_name === localStorage.getItem('username') && item.rater_role != 3) {
                        return item
                    }
                })
                console.log(my_feedbacks)

                const projectfeedback = feeds.filter((item) => {
                    if (item.rater_role === 3 && item.user_name == localStorage.getItem("username")) {
                        return item
                    }
                })
                console.log(projectfeedback)
                setFeedBacks(my_feedbacks)
                setProjectRate(projectfeedback[0])
            } else {
                console.log('here!!!!')
                setFeedBacks([])
                setProjectRate(null)
            }
        } else {
                console.log('wrong')
        }
      })
    }, []);

//   if (feedbacks.length == 0) {
//     setFeedBacks(data.milestones)
//   }


  return (
    <div>
        <Header/>

            <div className="feedbackpage">
                <div>


                    <div className='feedbacktitle container' style={{paddingTop: '30px'}}><h3>Student FeedBack Dashboard</h3></div>

                    <div className='container flex dashboard' style={{marginTop: '20px'}}>
                        <div className='project-feedback flex center shadow' style={{width: '100%'}}>
                            <h3 style={{padding: '1%', margin:'10px'}}>Project Name: {param.project_name}</h3>
                            <h3 style={{padding: '1%', margin:'10px'}}>Rated:<span>&nbsp;</span>
                            {
                                projectRate == null || projectRate.rate == null ?
                                <span> Not rated yet</span>
                                :
                                <Rating name="read-only" value={projectRate.rate} readOnly />
                            }
                            </h3>
                        </div>


                    {
                        feedbacks.length > 0 ?
                        feedbacks.map((item, index) => {
                            return (
                                <div className='feedbackdashboard shadow'>
                                    <div className='index'>{index + 1}</div>
                                    <div className='milestonename item shadow'>{item.milestone_name}</div>
                                    {
                                        item.content != null ?
                                        <div className='feedback item shadow'>{item.content}</div>
                                        :
                                        <div className='feedback item shadow'>No feedback yet</div>
                                    }
                                    {
                                        item.rate != null ?
                                        <div className='rate item'>
                                            <Rating name="read-only" value={item.rate} readOnly />
                                        </div>
                                        :
                                        <div className='rate item shadow'>Not rated yet</div>
                                    }

                                </div>
                            )
                        }):
                        <div className='container flex center shadow' style={{marginTop: '30px', padding: '10px'}}>
                            <h1>No milestones currently</h1>
                        </div>
                    }
                    </div>
                </div>

            </div>


    </div>
  )
}

export default Studentfeedbackpage
