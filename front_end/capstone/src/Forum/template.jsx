import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import Header from '../ProtoTemplate/Header';
import { Button, Link, cardActionAreaClasses } from '@mui/material';
import { Input as BaseInput } from '@mui/base/Input';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { useParams } from 'react-router-dom';
import { get, post } from '../AxiosInstance/axiosController';
import moment from 'moment';

const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const InputElement = styled('input')(
  ({ theme }) => `
  width: 800px;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 4px ${
    theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
  };

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);

const Textarea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
  width: 800px;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);



const columns = [
  { id: 'title', label: 'Title', minWidth: 170 },
  { id: 'creator',
    label: 'Creator',
    minWidth: 100,
    align: 'right'
  },
  {
    id: 'date',
    label: 'Create date',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'reply',
    label: 'Number of reply',
    minWidth: 170,
    align: 'right',
  },
];

const Input = React.forwardRef(function CustomInput(props, ref) {
  return <BaseInput slots={{ input: InputElement }} {...props} ref={ref} />;
});

function createData(title, creator, date, reply, id) {
  if (id != null) {
    return { title, creator, date, reply, id};
  }
  return { title, creator, date, reply};
}

const rowsData = [
  createData('title1', 'jinyuan1', '1/1/2011', 10),
  createData('title1', 'jinyuan1', '1/1/2011', 10),
  createData('title1', 'jinyuan1', '1/1/2011', 10),
  createData('title1', 'jinyuan1', '1/1/2011', 10),
  createData('title1', 'jinyuan1', '1/1/2011', 10),
];

export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [createStatus, setCreateStatus] = React.useState(true);
  const [newTitle, setNewTitle] = React.useState("");
  const [newText, setNewText] = React.useState("");
  const [rows, setRows] = React.useState([])

  const param = useParams()

  React.useEffect(()=> {
    get('/api/projectforum?project_id=' + param.project_id).then((response)=> {
        if (response.status === 200) {
          const rowData = []
          console.log(response.data.data)
          if (response.data.data.length > 0) {
            for (var i = 0; i < response.data.data.length; i++) {
              const temp = response.data.data[i]
              var date = new Date(temp.create_date)
              rowData.push(createData(temp.title, temp.creator, date.toLocaleString().split(',')[0], temp.num_of_reply, temp.post_id))
            }
            setRows(rowData)
          }
        } else {
            console.log('wrong')
        }
    })
  }, [])

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#ffeb3b',
      color: theme.palette.common.black,
      fontSize:20,
      fontWeight: 800
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


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleNewTitle = (e) => {
    setNewTitle(e.target.value)
  }

  const handleNewText = (e) => {
    setNewText(e.target.value)
  }

  const handleSubmit = () => {
    const create_time = moment().format('DD-MM-YYYY')
    const newRow = createData(newTitle, localStorage.getItem('username'), create_time, 0)
    const json_obj = {
      title: newTitle,
      content: newText
    }
    const postdata = {
      project_id: param.project_id,
      post: {
        title: newTitle,
        creator: localStorage.getItem('username'),
        num_of_reply: 0,
        create_date: create_time,
        reply_json : json_obj
      }
    }
    console.log(postdata)

    post('/api/projectforum', postdata).then((response)=> {
        if (response.status === 200) {
          console.log(response)
          alert(newRow.title + " is posted.")
          setCreateStatus(true)
          window.location.reload()
        } else {
            console.log('wrong')
        }
    })
  }


  return (
    <>
     <Header/>
     <div className='container' style={{width: "65%"}}>
     {
        createStatus ? (
          <div className="container flex center">
            <Button component="label" variant="contained" style= {{marginTop: "30px", marginBottom: "30px"}} onClick={()=> {setCreateStatus(false)}}>Create post</Button>
          </div>
        ) : (
          <>
            <div className='container flex center' style={{flexDirection: 'column', marginTop: '5%'}}>
              <h1>Create a new thread</h1>
              <Input aria-label="Demo input" placeholder="Title" onChange={handleNewTitle} />
              <Textarea aria-label="minimum height" minRows={3} placeholder="Type your post here" onChange={handleNewText}/>
              <div className='container flex center' style={{marginTop: '30px'}}>
                <Button component="label" variant="contained" onClick={handleSubmit} style={{marginRight: '20px', marginBottom: '20px'}}>Submit</Button>
                <Button component="label" variant="contained" onClick={()=> {setCreateStatus(true)}} style={{marginRight: '20px', marginBottom: '20px'}}>Cancel</Button>
              </div>

            </div>
          </>
        )
      }
     </div>
     <div className='container flex center'>
        <Paper sx={{ width: '80%', overflow: 'hidden', margin: 'auto'}}>
          <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
              <TableHead>
                  <TableRow>
                  {columns.map((column) => (
                      <StyledTableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                      >
                      {column.label}
                      </StyledTableCell>
                  ))}
                  </TableRow>
              </TableHead>
              <TableBody>
                  {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                      return (
                      <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                          {columns.map((column) => {
                          const value = row[column.id];
                          const post_id = row.id
                          return (
                              <StyledTableCell key={column.id} align={column.align}>
                              {column.id == 'title'
                                  ? <Link href={`/questionforum/${param.project_id}/${post_id}`} underline="hover">{value}</Link>
                                  : value
                              }
                              </StyledTableCell>
                          );
                          })}
                      </StyledTableRow>
                      );
                  })}
              </TableBody>
              </Table>
          </TableContainer>
          <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
          />
          </Paper>
     </div>

    </>
  );
}