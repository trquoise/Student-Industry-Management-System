import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
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
        <div className='upload-btn'>
            <button className='Upload' onClick={handleClickOpen}>Upload</button>
        </div>

        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth = "true">
            <DialogTitle id="form-dialog-title">Upload Profile</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Upload Your File
            </DialogContentText>
            <Form/>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button form='personal-info-form'  color="primary">
                Submit
            </Button>
            </DialogActions>
        </Dialog>
    </div>
  );
}
