import React from 'react';
import Header from '../../ProtoTemplate/Header';
import './supervisorfeedbackpage.css';
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
import FeedBackForm from './FeedBackForm';

const Supervisorfeedbackpage = () => {

  const param = useParams()

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
    var target = null
    for (var i = 0; i < feedbacks.length; i++) {
      if (target != null) {
        break
      }
      for (var j = 0; j< feedbacks[i].length; j++) {
        if (feedbacks[i][j].id == feedbackId) {
          target = feedbacks[i][j]
          break
        }
      }
    }
    var newFeedback = {...target, content: new_data.content, rate: new_data.rate}
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


  const groupBy = (array, f) => {
    let groups = {};
    array.forEach((o) => {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || []
      groups[group].push(o)
    });
    return Object.keys(groups).map((group) => {
      return groups[group]
    })
  }

  const arrayGroupBy = (list, groupId) => {
    let sorted = groupBy(list, (item) => {
      return [item[groupId]];
    })
    return sorted
  }

  React.useEffect(() => {
    get('/api/projectfeedback?project_id=' + param.project_id).then((response)=> {
        console.log(response)
        if (response.status === 200) {
            if (response.data.code === 200) {
                const feeds = response.data.data
                const my_feedbacks = feeds.filter((item) => {
                    if (item.rater_name === localStorage.getItem('username') && item.rater_role == 2) {
                        return item
                    }
                })
                console.log(my_feedbacks)
                const feedbacks_group = arrayGroupBy(my_feedbacks, 'milestone_name')
                console.log(feedbacks_group)

                const projectfeedback = feeds.filter((item) => {
                    if (item.rater_role === 3 && item.user_name == localStorage.getItem('username')) {
                        return item
                    }
                })
                console.log(projectfeedback)

                setFeedBacks(feedbacks_group)
                setProjectRate(projectfeedback[0])
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
      <div className="feedbackpage container">
            <div>
                <div className='feedbacktitle'><h3>Supervisor FeedBack Dashboard</h3></div>
                <div className='flex dashboard shadow'>
                    <div className='project-feedback flex center'>
                        {/* <div className="left"><h3>Project Name: {param.project_name}</h3></div> */}
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
                        feedbacks.map((group, index) => {
                            return group.map((item, index) => {
                              return (
                                <>
                                  <div className='project-feedback'><h3 style={{padding: '1%', margin:'10px'}}>Milestone name: {item.milestone_name}</h3></div>
                                  <div className='feedbackdashboard'>
                                      <div className='index'>{index + 1}</div>
                                      <div className='studentname item shadow'>{item.user_name}</div>
                                      {
                                        item.content == null || item.content.length == null ?
                                        <div className='feedback item shadow'>no comment yet</div>
                                        :
                                        <div className='feedback item shadow'>{item.content}</div>
                                      }
                                      {
                                        item.rate == null ?
                                        <div className='feedback item shadow'>not rated yet</div>
                                        :
                                        <div className='feedback item shadow'>
                                          <Rating name="read-only" value={item.rate} readOnly />
                                        </div>
                                      }

                                      <Button component="label" variant="contained" className='edit' id = {item.id} onClick={()=> handleClickOpen(item.id)} >Edit</Button>
                                  </div>
                                </>
                              )
                            })
                        })
                    }

                </div>

            </div>

        </div>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth = "true">
            <DialogTitle id="form-dialog-title">Edit Profile</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Edit the feedback
            </DialogContentText>
            <FeedBackForm/>
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

  )
}

export default Supervisorfeedbackpage
