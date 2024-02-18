import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import './editBtn.css'
import Form from './Form';

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className='container flex edit-section'>
        <div className='edit-btn'>
            <button className='Edit' onClick={handleClickOpen}>Edit</button>
        </div>

        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth = "true">
            <DialogTitle id="form-dialog-title">Edit Profile</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Edit your personal Information
            </DialogContentText>
            <Form/>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleClose} color="primary">
                Submit
            </Button>
            </DialogActions>
        </Dialog>
    </div>
  );
}