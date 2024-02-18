import React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import './editBtnPersonalInfo.css'
import ProjectInfForm from './ProjectInfForm'
import { post, get} from '../../AxiosInstance/axiosController';
import Moment from 'moment';


export default function EditBtnProjectExp(props) {
  const [open, setOpen] = React.useState(false);
  const [detailNums, setDetailNums] = React.useState(1);
  const [projectInfo, setProjectInfo] = React.useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addNewDetail = () => {
    setDetailNums (detailNums+1);
    setProjectInfo([...projectInfo, {'project_name': '', 'discipline':'', 'start_date': '', 'end_date': ''}])
    localStorage.setItem('projectInfo', JSON.stringify(projectInfo))
  }

  const removeDetail = () => {
    setDetailNums (detailNums-1);
    setProjectInfo(projectInfo.slice(0, -1))
    localStorage.setItem('projectInfo', JSON.stringify(projectInfo.slice(0, -1)))
  }

  const handleSubmit = () => {
    const newInfo = JSON.parse(localStorage.getItem('projectInfo'))
    console.log("************")
    console.log(newInfo)
    setProjectInfo(newInfo)

    post("/api/userProjectExperience", {data: newInfo})
      .then((response) => {
        props.setData(newInfo)
      }).catch((error) => {
        console.log(error)
    });

    setOpen(false);
  }


  React.useEffect(() => {
    get('/api/userProjectExperience').then((response) => {
        if (response.data.code == 200) {
          const maps = response.data.data.map((item) => {
            return {project_name: item.project_name, discipline: item.discipline, start_date: item.start_date, end_date: item.end_date}
          })
          setProjectInfo([...maps, ...projectInfo])
          localStorage.setItem('projectInfo', JSON.stringify([...maps, ...projectInfo]))

          var len = [...maps, ...projectInfo].length
          setDetailNums(len)
        } else {
          setProjectInfo([projectInfo])
          localStorage.setItem('projectInfo', JSON.stringify(projectInfo))
        }
    })
  }, []);

  return (
    <div className='container flex edit-section'>
        <div className='edit-btn'>
            <Button variant="contained" color="primary" className='Edit' onClick={handleClickOpen}>Edit</Button>
        </div>

        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth = "true">
            <DialogTitle id="form-dialog-title">Edit Profile</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Edit your project experience
            </DialogContentText>
            <>
              {(() => {
                const arr = [];
                for (let i =0; i< detailNums;i++) {
                  arr.push(
                    <div>
                      <ProjectInfForm key = {i} info = {projectInfo[i]} index = {i}/>
                    </div>
                  );
                }
                return arr;
              })()}
            </>
            {/* <ProjectInfForm/> */}
            </DialogContent>
            <DialogActions>
            <Button onClick={addNewDetail} color="primary">
                Add
            </Button>
            {
                detailNums > 1 &&
                <Button onClick={removeDetail} color="primary">
                    Remove
                </Button>
            }
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
                Submit
            </Button>
            </DialogActions>
        </Dialog>
    </div>
  );
}