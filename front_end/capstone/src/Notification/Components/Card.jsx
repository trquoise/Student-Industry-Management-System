import * as React from 'react';
// import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
// import {green} from "@mui/material/colors";
import ResponsiveDialog from "./ResponsiveDialog";
import Invitation from "./Invitation";
import { get, post } from "../../AxiosInstance/axiosController";
// import request from '../request'
import { Container } from '@mui/system';
import Divider from '@mui/material/Divider';
import { Box } from '@mui/system';


export default function NotificationCard({data={}, fetchData, getProcessedList, getUnprocessList, sortList, invitation}) {

    const [listData, setListData] = useState(data);
    const [invite, setInvite] = useState({});
    // const [processedData, setProcessedData] = useState(props.data.filter(items => items.status !== null))
    // const [unprocessedData, setUnprocessList] = useState(props.data.filter(items => items.status === null))
    const responsiveDialogStyle = {border:'0px'}
    const Identification = window.localStorage.getItem('role');
    // debugger;
    // console.log("This is the invitation", invitation)
    // debugger;


  const processedData = data.filter(items => items.status !== null)
  const unprocessedData = data.filter(items => items.status === null)


  const giveBackList = () => {
        // console.log("processedData", processedData)
        getProcessedList(processedData)
  }

  const giveBacktoList = () => {
        // console.log("unprocessedData", unprocessedData)
        getUnprocessList(unprocessedData)
  }

    // console.log("processedData", processedData)
    useEffect(() =>{
            setListData(data);
            setInvite(invitation)
            // debugger
            giveBackList()
            giveBacktoList();
            // console.log("delete array", listData)
    },[data, invitation])





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
    const renderInput = (list) =>{
        // console.log("render",list)
        return(list.map((items, index) => {
            // console.log("item", items)
            return(
                <Paper sx={{ minWidth: 275, maxWidth: 1520,  
                    backgroundColor: items.status == null ? " " : "gray", 
                    mt: 2,
                  }}key ={index} elevation = {12}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                             Notification from {items.applicant_emails}
                        </Typography>
                                <br/>
                        {
                            (Identification == 1|| Identification == 2)&&<Typography variant="body2">
                            Your application on project: ----{items.project_name}----- {returnValue(items.status)}on{items.apply_time}
                        </Typography>
                        }
                        {  
                            (Identification == 3)&&<Typography variant="body2">
                            Your have received an application on project: {items.project_name} from {items.applicant_emails} on {items.apply_time}
                        </Typography>
                        }
                    </CardContent>
                    <CardActions>
                        <ResponsiveDialog size="small" style = {responsiveDialogStyle} data ={items} fetchData = {fetchData}>View Details</ResponsiveDialog>
                    </CardActions>
                </Paper>
            )
        }))

    }

    const renderInviter = (list) =>{
        // console.log("This is list",list)
        // debugger;
        if(list.length !== 0){
            return(list.map((items, index) => {
                // console.log("item", items)
                return(
                    <Paper sx={{ minWidth: 275, maxWidth: 1520,  
                        backgroundColor: items.status == null ? " " : "gray", 
                        mt: 2,
                      }}key ={index} elevation = {12}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                 Your invitation to {items.invited_name}
                            </Typography>
                                    <br/>
                            <Typography variant="body2">
                                You have sent an invitation to{items.invited_name}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Invitation size="small" style = {responsiveDialogStyle} data ={items} fetchData = {fetchData}>View Details</Invitation>
                        </CardActions>
                    </Paper>
                )
            }))

        }else{
            return
        }
    }

    const renderInvited = (list) =>{
        console.log("This is list",list)
        // debugger;
        if(list.length !== 0){
            return(list.map((items, index) => {
                // console.log("item", items)
                return(
                    <Paper sx={{ minWidth: 275, maxWidth: 1520,  
                        backgroundColor: items.status == null ? " " : "gray", 
                        mt: 2,
                      }}key ={index} elevation = {12}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                 Your invitation from {items.inviter_name}
                            </Typography>
                                    <br/>
                            <Typography variant="body2">
                                You have received an invitation from an invitation from {items.inviter_name}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Invitation size="small" style = {responsiveDialogStyle} data ={items} fetchData = {fetchData}>View Details</Invitation>
                        </CardActions>
                    </Paper>
                )
            }))

        }else{
            return
        }
    }


  return (
    <Container>
        <Typography variant="button" sx={{color:"gray"}}>Notifications need to processed</Typography>
        <Divider sx={{border:"1px solid gray", mt:1, mb:5, ml:2}}/>
        {sortList.length === 0? renderInput(unprocessedData): renderInput(sortList)}
        <Box sx={{mt:4}}></Box>
        <Typography variant="button" sx={{color:"gray", mt:5}}>Notifications have been processed</Typography>
        <Divider sx={{border:"1px solid gray", mt:1, mb:5, ml:2}}/>
        {renderInput(processedData)}
        <Typography variant="button" sx={{color:"gray", mt:5}}>Invitations</Typography>
        <Divider sx={{border:"1px solid gray", mt:1, mb:5, ml:2}}/>
        {/* {invite && invite?.inviter_infos && <Box sx={{border:"1px solid red"}}>{invite.inviter_infos}</Box>} */}
        {invite && invite?.inviter_infos && renderInviter(invite.inviter_infos)}
        {invite && invite?.invited_infos && renderInvited(invite.invited_infos)}

    </Container>
  );
}
