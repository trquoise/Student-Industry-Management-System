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



export default function CustomizedTables() {
    const[project, setProject] = React.useState([])

    useEffect(() => {
        fetch("/api/recommandateprojects", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => response.json())
            .then((res) => {
                // console.log("res =", res)
                // console.log("resdata =", res.data)
                setProject(res.data);
            })
            .catch((error) => console.error("Error:", error));
    }, []);


  return (
    <TableContainer component={Paper} sx={{mt:23}}>
      <Table sx={{ minWidth: "300px"}} aria-label="customized table">
        <TableHead>
            <TableRow>
                <TableCell align='center' colspan={4}>
                    <Typography variant='button'>
                        Recommended Projects
                    </Typography>
                </TableCell>
            </TableRow>            
          <TableRow >
            <StyledTableCell align="left" colspan={1}>Owner Name</StyledTableCell>
            {/* <StyledTableCell align="right">Project ID</StyledTableCell> */}
            <StyledTableCell align="left" colspan={2}>Project Name</StyledTableCell>
            {/* <StyledTableCell align="right">Score</StyledTableCell> */}
            <StyledTableCell align="left" colspan={2}>Link</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {project.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row" align="left" colspan={1}>
                {row.owner_username}
              </StyledTableCell>
              {/* <StyledTableCell align="right">{row.project_id}</StyledTableCell> */}
              <StyledTableCell align="left" colspan={2}>{row.project_name}</StyledTableCell>
              {/* <StyledTableCell align="right">{row.tag_score}</StyledTableCell> */}
              <StyledTableCell align="left" colspan={2}><Link to={`/apply/${row.project_id}`}><StyleButton>jump</StyleButton></Link></StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
