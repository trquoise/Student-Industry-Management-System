import { useState } from 'react';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from '@mui/material';

// import TablePagination from '@mui/material/TablePagination';




// const columns = [
//   { id: 'title', label: 'title', minWidth: 170 },
//   { id: 'creator', label: 'creator', minWidth: 100 },
//   {
//     id: 'date',
//     label: 'date',
//     minWidth: 170,
//     align: 'right',
//     // format: (value) => value.toLocaleString('en-US'),
//   },
//   {
//     id: 'numberofreply',
//     label: 'numberofreply',
//     minWidth: 170,
//     align: 'right',
//     // format: (value) => value.toLocaleString('en-US'),
//   },
// //   {
// //     id: 'density',
// //     label: 'Density',
// //     minWidth: 170,
// //     align: 'right',
// //     format: (value) => value.toFixed(2),
// //   },
// // ];

// function createData(title, creator, date, numberofreply) {
//   return {title, creator, date, numberofreply};
// }

// const rowsData = [
//   createData('title1', 'jinyuan1', 6.0, 24),
//   createData('title2', 'jinyuan1', 9.0, 37),
//   createData('title3', 'jinyuan1', 16.0, 24),
//   createData('title4', 'jinyuan1', 3.7, 67),
//   createData('title5', 'jinyuan1', 16.0, 49),
// ];

// const Createforum = () => {
//   const [createStatus, setCreateStatus] = useState(true);
//   const [newTitle, setNewTitle] = useState("");
//   const [newText, setNewText] = useState("");
//   const [rows, setRows] = useState(rowsData)

//   const StyledTableCell = styled(TableCell)(({ theme }) => ({
//     [`&.${tableCellClasses.head}`]: {
//       backgroundColor: '#ffeb3b',
//       color: theme.palette.common.black,
//       fontSize:20,
//       fontWeight: 800
//     },
//     [`&.${tableCellClasses.body}`]: {
//       fontSize: 14,
//     },
//   }));

//   const StyledTableRow = styled(TableRow)(({ theme }) => ({
//     '&:nth-of-type(odd)': {
//       backgroundColor: theme.palette.action.hover,
//     },
//     // hide last border
//     '&:last-child td, &:last-child th': {
//       border: 0,
//     },
//   }));


//   const handleNewTitle = (e) => {
//     setNewTitle(e.target.value)
//   }

//   const handleNewText = (e) => {
//     setNewText(e.target.value)
//   }

//   const handleSubmit = () => {
//     const newRow = createData(newTitle, 'jinyuan1', '2023-11-06', 0)
//     setRows([...rows, newRow])
//   }

//   return (
//     <div>
//       <div className ="flex flex-col mt-4 ml-3 gap-6">
//       {createStatus ? (
//       <button
//       className="border-[1px] border-zinc-400 rounded-full w-40"
//       onClick={()=> {setCreateStatus(false)}}
//       >Create post</button>
//       ) : (
//         <>
//           <button
//             className="border-[1px] border-zinc-400 rounded-full w-40"
//             onClick={()=> {setCreateStatus(true)}}
//             >Cancel
//           </button>
//           <div className='flex flex-col gap-3 justify-center items-center'>
//             <input placeholder='title' className="border-[1px] border-zinc-400 p-4 w-3/4" onChange={handleNewTitle}/>
//             <textarea placeholder='type your post here' className="border-[1px] border-zinc-400 p-8 w-3/4" onChange={handleNewText}></textarea>
//             <div className=' flex justify-end'>
//               <button className="border-[1px] border-zinc-400 rounded-full w-40 " onClick={handleSubmit}>Submit</button>
//             </div>


//           </div>

//         </>

//         )}
//       </div>

//        <TableContainer component={Paper} className='mt-10' sx = {{maxWidth:"80%", margin:"auto", marginTop: "20px "}} >
//         <Table sx={{ minWidth: 500 }} aria-label="customized table">
//           <TableHead >
//             <TableRow>
//               <StyledTableCell>Title</StyledTableCell>
//               <StyledTableCell align="right">Creator</StyledTableCell>
//               <StyledTableCell align="right">Date</StyledTableCell>
//               <StyledTableCell align="right">Number of reply</StyledTableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows.map((row) => (
//               <StyledTableRow key={row.title}>
//                 <StyledTableCell component="th" scope="row">
//                   <Link href= '#' underline="hover"> {row.title}</Link>
//                 </StyledTableCell>
//                 <StyledTableCell align="right">{row.creator}</StyledTableCell>
//                 <StyledTableCell align="right">{row.date}</StyledTableCell>
//                 <StyledTableCell align="right">{row.numberofreply}</StyledTableCell>
//               </StyledTableRow>
//             ))}
//           </TableBody>
//         </Table>
//     </TableContainer>

//     </div>


//   )
// }

// export default Createforum