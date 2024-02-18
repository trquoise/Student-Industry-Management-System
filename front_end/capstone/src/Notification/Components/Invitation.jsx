import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useCallback } from 'react';
import { useEffect } from 'react';
import {Link} from 'react-router-dom';




export default function Invitation(props) {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const theme = useTheme();
    const [status, setStatus] = React.useState({})
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    // console.log("pppp:", props.data)
    const Identification = window.localStorage.getItem('role');
    const cardData = props.data
    const user = window.localStorage.getItem('username');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    

    const handleAccept = () => {
        setTimeout(()=>{
            props.fetchData()
            console.log("refresh")
        },1000)
    }


 
    // const giveBack = ()=> {
    //     let postData = {
    //         id: cardData.id,
    //         invited_email: cardData.invited_email,
    //         invited_name: cardData.invited_name,
    //         invited_user_id: cardData.invited_user_id,
    //         inviter_email: cardData.inviter_email,
    //         inviter_name: cardData.invited_name,
    //         inviter_user_id: cardData.inviter_user_id,
    //         project_id: cardData.project_id,
    //         status: cardData.status
    //     }
    //     console.log("this is the data to post", postData)
        
    //     fetch("/api/projectinvitation", {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //           'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //         },
    //         body: JSON.stringify(
    //             postData
    //         ),
    //       })
    //         .then((response) => response.json())
    //         .then((data) => {
    //         //   if (data.success) {
    //         //     alert("success");
    //         //   } else {
    //         //     alert("Failed");
    //         //   }
    //         })
    //         .catch((error) => {
    //           console.error("Error:", error);
    //           alert(
    //             "An error occurred"
    //           );
    //         });

    // }

    const getDetail = ()=> {
        console.log("invitecardData", cardData);
    }
    const returnValue = (value) =>{
        if (value === 0)
        {
            return "has been reject";
        }
        if(value === 1)
        {
            return "has been accept";
        }
        if (value === null)
        {
            return "hasn't been processed";
        }

    }



    useEffect(()=>{
        getDetail();
    },[])

    const renderDialog = (cardData) =>{
        return(
            <>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"This is detail massage"}
                </DialogTitle>
                <DialogContent>
                        {
                            (Identification == 1|| Identification == 2) && 
                            <Typography variant="body2">Dear {user}, you have received an invitation from {cardData.inviter_name} for <Link to={`/apply/${cardData.project_id}`}>project {cardData.project_id},</Link> would you like to accept it?</Typography>
                        
                        }
                        {
                            (Identification == 3)&&                                    <Typography variant="body2">
                            Dear industryPartner, your invitation to  {cardData.invited_name} for <Link to={`/apply/${cardData.project_id}`}>this project</Link> has been sent, and its status is {returnValue(cardData.status)}
                        </Typography>
                        }
                </DialogContent>
                <DialogActions>
                        {
                            (Identification == 3)
                            &&
                            <>
                    <Button onClick={handleClose} autoFocus>
                        Dismiss
                    </Button>
                            </>
                        }
                        {
                            (Identification == 2|| Identification == 3)
                            &&
                            <>
                    <Button autoFocus onClick={()=>{handleClose(); handleAccept()}}>
                        <Link to={`/apply/${cardData.project_id}`}>See Details</Link>
                    </Button>
                    <Button onClick={()=>{handleClose()}} autoFocus>
                        Dismiss
                    </Button>
                            </>
                        }

                </DialogActions>
            </Dialog>
            </>
        )

    }

    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                View Details
            </Button>
            {open? renderDialog(cardData):' ' }
          
        </>
    );
}
