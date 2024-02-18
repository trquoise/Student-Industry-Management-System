import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {Link} from 'react-router-dom'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { useState } from 'react';


import { createTheme } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';

const wholetheme = createTheme({
    palette: {
      primary: {
        main: '#FFDC00',
      },
      secondary: {
        main: '#f73378',
      },
    },
  });

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: wholetheme.palette.primary.main,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyleButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    variant: 'text',
}))

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

// const rows = [...project];



export default function CustomizedTables({projectId}) {
    const[supervisors, setSupervisors] = React.useState([])
    const [selectedResearcher, setSelectedResearcher] = useState(null);
    const Identification = window.localStorage.getItem('role')

    const handleInvite = (userId) => {
        fetch("/api/projectinvitation", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            invited_userID: userId,
            project_id: projectId,
          })
        })
        .then(response => response.json())
        .then(data => {
        //   console.log("Invitation sent:", data);
          handleClose();
        })
        .catch(error => console.error("Error sending invitation:", error));
      };

    const clickHandler = (researcher) => {
        setSelectedResearcher(researcher);
      };

    const handleClose = () => {
        setSelectedResearcher(null);
      };

    useEffect(() => {
        fetch("/api/recommandateresearchers", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => response.json())
            .then((res) => {
                // console.log("res =", res)
                console.log("resdata =", res.data)
                setSupervisors(res.data);
            })
            .catch((error) => console.error("Error:", error));
    }, []);


  return (
    <TableContainer component={Paper} sx={{mt:0}}>

      <Table sx={{ minWidth: "300px"}} aria-label="customized table">
        <TableHead>
            <TableRow>
                <TableCell align='center' colspan={4}>
                    <Typography variant='button'>
                        Recommended Supervisors
                    </Typography>
                </TableCell>
            </TableRow>            
          <TableRow >
            <StyledTableCell align="left" colspan={2}>Supervisor Name</StyledTableCell>
            {/* <StyledTableCell align="right">Project ID</StyledTableCell> */}
            {/* <StyledTableCell align="left" colspan={2}>Project Name</StyledTableCell> */}
            {/* <StyledTableCell align="right">Score</StyledTableCell> */}
            <StyledTableCell align="center" colspan={2}>See More Details</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {supervisors.map((row, index) => (
            <StyledTableRow key={index}>
                    <Dialog
                      open={selectedResearcher?.researcher_user_id === row.researcher_user_id}
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                          {"This is the E-mail"}
                      </DialogTitle>
                      <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                              {selectedResearcher?.researcher_email}
                          </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                          <Button onClick={handleClose}>Close</Button>
{Identification == 1? ' ':<Button onClick={() => handleInvite(row.researcher_user_id)} autoFocus>
                              Invite
                          </Button>}
                      </DialogActions>
                    </Dialog>
              {/* <StyledTableCell component="th" scope="row" align="left" colspan={1}>
                {row.owner_username}
              </StyledTableCell> */}
              {/* <StyledTableCell align="right">{row.project_id}</StyledTableCell> */}
              <StyledTableCell align="left" colspan={2}>{row.academic_researcher_name}</StyledTableCell>
              {/* <StyledTableCell align="right">{row.tag_score}</StyledTableCell> */}
              <StyledTableCell align="center" colspan={2}><StyleButton onClick={() => clickHandler(row)}>Detail</StyleButton></StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
