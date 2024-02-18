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
import {get} from '../../AxiosInstance/axiosController'
import Panel from './Panel/panel';



export default function ResponsiveDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [panel, setPanel] = React.useState(false)
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

    const handlePanelOpen = () => {
        setPanel(true);
        // console.log("pppp:", panel)

    };

    const handleClose = () => {
        setOpen(false);
    };

    const handlePanelClose = (data) => {
        setPanel(data);
    };
    
    const handleReject = () => {
        alert('Reject')
        cardData.status = 0;
        // props.delete(props.data.id)
        console.log("you have reject the application",user)
        giveBack()
        // console.log("reject successful")
        setTimeout(()=>{
            props.fetchData()
        },1000)

    }

    const handleAccept = () => {
        alert('Accpet')
        cardData.status = 1;
        console.log("you have accept the application", user)
        giveBack()
        setTimeout(()=>{
            props.fetchData()
            console.log("refresh")
        },1000)
    }

    const returnValue = (value) =>{
        if (value === 0)
        {
            return "reject";
        }
        if(value === 1)
        {
            return "accept";
        }
        if (value === null)
        {
            return "haven't been processed";
        }

    }

 
    const giveBack = ()=> {
        let postData = {
            project_id: cardData.project_id,
            applicant_user_id: cardData.applicant_id,
            status: cardData.status
        }
        console.log("this is the data to post", postData)
        
        fetch("/api/projectApplication", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(
                postData
            ),
          })
            .then((response) => response.json())
            .then((data) => {
            //   if (data.success) {
            //     alert("success");
            //   } else {
            //     alert("Failed");
            //   }
            })
            .catch((error) => {
              console.error("Error:", error);
              alert(
                "An error occurred"
              );
            });

    }

    const getDetail = ()=> {
        // console.log("cardData", cardData);
    }



    useEffect(()=>{
        getDetail();
    },[])

    return (
        <>   
        <Panel isopen={panel} handlePanel={handlePanelClose} data={props.data}/>
            <Button variant="outlined" onClick={handleClickOpen}>
                View Details
            </Button>
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
                            (Identification == 1|| Identification == 2)&&(cardData.status == 0 || cardData.status == 1) && 
                            <Typography variant="body2">Dear {user}, your application for <Link to={`/appply/${cardData.project_id}`}> {cardData.project_name}</Link> has been processed successfully, and you have been {returnValue(cardData.status)}ed the project!</Typography>
                        
                        }
                        {
                            (Identification == 1|| Identification == 2)&&(cardData.status == null) && 
                            <Typography variant="body2">Dear {user}, your application for <Link to={`/appply/${cardData.project_id}`}> {cardData.project_name}</Link>has not been processed yet</Typography>
                        }
                        {
                            (Identification == 3)&&                                    <Typography variant="body2">
                            Dear {user}, you have received an application from  <a href="#" onClick={handlePanelOpen}>applicant {cardData.applicant_id}</a> for <Link to={`/apply/${cardData.project_id}`}>{cardData.project_name}</Link>, would you like to accept or reject the application
                        </Typography>
                        }
                </DialogContent>
                <DialogActions>
                        {
                            (Identification == 3 && cardData.status == null)
                            &&
                            <>
                    <Button autoFocus onClick={()=>{handleClose(); handleAccept()}}>
                        Accept
                    </Button>
                    <Button onClick={()=>{handleClose(); handleReject()}} autoFocus>
                        Reject
                    </Button>
                            </>
                        }
                        {
                            (Identification == 3 && cardData.status !== null)
                            &&
                            <>
                    <Button autoFocus onClick={handleClose}>
                            you have {returnValue(cardData.status)}ed the project
                    </Button>
                    </>                     
                        }
                        {/* {
                            (Identification == 3 && cardData.status == null)
                            &&
                            <>
                    <Button autoFocus onClick={()=>{handleClose(); handleAccept()}}>
                        Accept
                    </Button>
                    <Button onClick={()=>{handleClose(); handleReject()}} autoFocus>
                        Reject
                    </Button>
                            </>

                        } */}
                        {
                            (Identification == 1|| Identification == 2)
                            &&
                            <>
                    <Button onClick={handleClose} autoFocus>
                        Dismiss
                    </Button>
                            </>
                        }

                </DialogActions>
            </Dialog>
        </>
    );
}
