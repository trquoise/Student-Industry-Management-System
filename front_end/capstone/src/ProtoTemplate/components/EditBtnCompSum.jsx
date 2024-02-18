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
import CompSumForm from './CompSumForm'
import { post } from '../../AxiosInstance/axiosController';

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const newInfo = JSON.parse(localStorage.getItem('companySum'))
    console.log(newInfo)

    post("/api/companyIntro", newInfo)
    .then((response) => {
      props.setData(newInfo)
    }).catch((error) => {
      console.log(error)
    });

    setOpen(false);
  };

  return (
    <div className='container flex edit-section'>
        <div className='edit-btn'>
            <Button variant="contained" color="primary" className='Edit' onClick={handleClickOpen}>Edit</Button>
        </div>

        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth = "true">
            <DialogTitle id="form-dialog-title">Edit Profile</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Edit your Company Summary
            </DialogContentText>
            <CompSumForm/>
            </DialogContent>
            <DialogActions>
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