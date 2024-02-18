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
import EduInfForm from './EduInfForm';
import { post,get } from '../../AxiosInstance/axiosController';

export default function EditBtnEduInfo(props) {
  const [open, setOpen] = React.useState(false);
  const [eduInfo, setEduInfo] = React.useState([]);
  const [detailNums, setDetailNums] = React.useState(1);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const newInfo = JSON.parse(localStorage.getItem('educationInfo'))
    console.log("************")
    console.log(newInfo)
    setEduInfo(newInfo)

    post("/api/userEducation", {data: newInfo})
      .then((response) => {
        props.setData(newInfo)
      }).catch((error) => {
        console.log(error)
      });
    setOpen(false);
  }

  const addNewDetail = () => {
    setDetailNums(detailNums + 1);
    setEduInfo([...eduInfo, {"major": "", "degree": ""}])
    localStorage.setItem('educationInfo', JSON.stringify(eduInfo))
  };

  const removeDetail = () => {
    setDetailNums(detailNums - 1);
    // setEduInfo(eduInfo.pop())
    console.log("&&&&&&")
    setEduInfo(eduInfo.slice(0, -1))
    localStorage.setItem('educationInfo', JSON.stringify(eduInfo.slice(0, -1)))
    console.log(localStorage.getItem('educationInfo'))
  };


  React.useEffect(() => {
    get('/api/userEducation').then((response) => {
        if (response.status === 200) {
          if (response.data.code != 200) {
            setEduInfo([...eduInfo])
            localStorage.setItem('educationInfo', JSON.stringify([...eduInfo]))
          } else {
            const maps = response.data.data.map((item) => {
              return {degree: item.degree, major: item.major}
            })
            var len = [...maps, ...eduInfo].length
            setEduInfo([...maps, ...eduInfo])
            localStorage.setItem('educationInfo', JSON.stringify([...maps, ...eduInfo]))
            setDetailNums(len)
          }
        } else {
            console.log('wrong')
        }
    })}, []);

  return (
    <div className='container flex edit-section'>
        <div className='edit-btn'>
            <Button variant="contained" color="primary" className='Edit' onClick={handleClickOpen}>Edit</Button>
        </div>

        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth = "true">
            <DialogTitle id="form-dialog-title">Edit Profile</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Edit your Education Detail
            </DialogContentText>
            <>
                {(() => {
                    const arr = [];
                    for (let i = 0; i < detailNums; i++) {
                        arr.push(
                            <div>
                                <EduInfForm key = {i} info = {eduInfo[i]} index = {i}/>
                            </div>
                        );
                    }
                    return arr;
                })()}
            </>
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