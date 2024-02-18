import React from 'react';
import Header from '../../ProtoTemplate/Header';
import './industryfeedback.css'
import { useParams } from 'react-router-dom';
import { get, post } from '../../AxiosInstance/axiosController';
import { Rating } from '@mui/material';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IndustryForm from './industryForm';

const IndustryfeedbackPage = () => {

  const param = useParams()
  console.log(param)

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
  const [open, setOpen] = React.useState(false);
  const [feedbackId, setFeedbackId] = React.useState(null)


  const handleClickOpen = (id) => {
    setFeedbackId(id)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (item) => {
    const new_data = JSON.parse(localStorage.getItem('feedback'))
    console.log(new_data)
    const target = feedbacks.filter((item) => {
        if (item.id == feedbackId) {
            return item
        }
    })
    var newFeedback = {...target[0], content: new_data.content, rate: new_data.rate}
    const body = {
      project_id : param.project_id,
      feedback: newFeedback
    }
    console.log(body)
    post('/api/projectfeedback', body)
        .then((response) => {
          if (response.status == 200) {
            alert('Updated success')
            window.location.reload()
          }
        }).catch((error) => {
          console.log(error)
      });
      setOpen(false);
   };


  React.useEffect(() => {
    get('/api/projectfeedback?project_id=' + param.project_id).then((response)=> {
        console.log(response)
        if (response.status === 200) {
            if (response.data.code === 200) {
                const feeds = response.data.data
                const my_feedbacks = feeds.filter((item) => {
                    if (item.rater_role == 3) {
                        return item
                    }
                })
                console.log(my_feedbacks)

                // const projectfeedback = feeds.filter((item) => {
                //     if (item.rater_role === 3) {
                //         return item
                //     }
                // })
                setFeedBacks(my_feedbacks)
                // setProjectRate(projectfeedback)
            } else {
                setFeedBacks([])
                setProjectRate(null)
            }
        } else {
                console.log('wrong')
        }
      })
    }, []);


  return (
    <div>
        <Header/>
        {
            <div className="feedbackpage container">
                <div>
                    <div className='feedbacktitle'><h3>Industry FeedBack Dashboard</h3></div>
                    <div className='dashboard'>

                        <div className='feedbackdashboard shadow'>
                            <div className='milestonename item shadow' style={{width: '100%', padding: "10px", textAlign: 'center'}}>Project Name: {param.project_name}</div>
                            {
                                feedbacks.length == 0 &&
                                <p style={{marginLeft: '20px', fontSize: '20px'}}>No candidate yet</p>
                            }
                        </div>
                    {   feedbacks.length > 0 &&
                        feedbacks.map((item, index) => {
                            console.log(item)
                            return (
                                <div className='feedbackdashboard shadow'>
                                    <div className='index'>{index + 1}</div>
                                    <div className='milestonename item shadow'>{item.user_name}</div>
                                    {
                                        item.rate != null ?
                                        <div className='rate item shadow'>
                                            <Rating name="read-only" value={item.rate} readOnly />
                                        </div>
                                        :
                                        <div className='rate item shadow'>Not rated yet</div>
                                    }
                                    <Button component="label" variant="contained" className='edit' id = {item.id} onClick={()=> handleClickOpen(item.id)} >Edit</Button>

                                </div>
                            )
                        })
                    }

                    </div>
                </div>
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth = "true">
                    <DialogTitle id="form-dialog-title">Edit Profile</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Edit the feedback
                    </DialogContentText>
                    <IndustryForm/>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button form='personal-info-form' onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                    </DialogActions>
                </Dialog>

            </div>

        }

        {/* {
            feedbacks.length > 0 ?
            <div className="feedbackpage">
                <div className='back-btn'>
                    <button className='back'>Back</button>
                </div>
                <div>
                    <div className='feedbacktitle'><h1>Student FeedBack Dashboard</h1></div>
                    <div className='container flex dashboard'>
                        <div className='feedbackdashboard'>
                            <div className='index'>1</div>
                            <div className='milestonename item'>Milestone Name</div>
                            <div className='feedback item'>Feedback</div>
                            <div className='rate item'>Rate</div>
                        </div>
                        <div className='feedbackdashboard'>
                            <div className='index'>2</div>
                            <div className='milestonename item'>Milestone Name</div>
                            <div className='feedback item'>Feedback</div>
                            <div className='rate item'>Rate</div>
                        </div>

                    </div>

                </div>

            </div>
            :
            <div className='container flex center'>
                <h1>No feedback currently</h1>
            </div>
        } */}
    </div>
  )
}

export default IndustryfeedbackPage
