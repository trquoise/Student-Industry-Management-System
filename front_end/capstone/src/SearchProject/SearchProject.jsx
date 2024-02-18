import * as React from 'react';
import Button from '@mui/joy/Button';
import Textarea from '@mui/joy/Textarea';
import Stack from '@mui/joy/Stack';
import NavBar from './Components/NavBar'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

export default function BasicModalDialog() {
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <NavBar/>
      {/* <Grid Container sx={{border:"1px solid red", height:"100%"}}> */}
        <Grid container sx={{height:"100%"}} alignContent="center" alignItems="center">
          <Stack direction="row" gap={-1} style={{margin:"500px auto"}}>
          <Textarea
            sx={{height:"50px", width:"500px", border:"2px solid #0A6BCB", mr:"-20px", verticalAlign:"center"}}
          />
          <Button sx={{height:"50px",width:"100px", borderRadius:"0 10px 10px 0"}}>Search</Button>
          </Stack>
        </Grid>
      {/* </Grid> */}

    </React.Fragment>
  );
}
