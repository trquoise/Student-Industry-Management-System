import {
  Container,
  Button,
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Avatar,
} from "@mui/material";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import banner from "../images/banner.png";
import itemImg from "../images/item.png";
import React, { useEffect, useState } from "react";
import Header from "../ProtoTemplate/Header";
import RecomProjects from "../ProtoTemplate/components/RecomProjects";
import { get } from "../AxiosInstance/axiosController";
import SendIcon from '@mui/icons-material/Send';
import { Navigate, useNavigate } from "react-router-dom";
import RecomSupervisors from '../ProtoTemplate/components/RecomSupervisors'

export default function Com() {
  const [listData, setListData] = useState([]);
  const role = window.localStorage.getItem('role');
  // console.log(role);
  useEffect(() => {
    get('/api/project').then((response)=> {
          // console.log(response)
          if (response.status === 200) {
            // console.log("this is response", response.data)
            setListData(response.data);
          } else {
            console.log('wrong')
          }
        })
  },[]);
  // const filteredList = listData.filter((item) => (item.curr_candidate < item.num_of_candidate && new Date(item.apply_end_data) > new Date()))
  const dateFormat = (date) =>{
    const [day, month, year] = date.split('-');
    return (`${month}-${day}-${year}`)

  }

  const filteredList = listData.filter((item) => item.curr_candidate < item.num_of_candidate && new Date(dateFormat(item.apply_end_date)) >= new Date() || item.academic_researcher == null)

  // const newArray = [1,2,3,4,5,6,7,8,9].filter((item) => (item>5))
  // console.log("filterdlist =", filteredList);

  return (
    <>
    <Header/>
    <Grid container direction="row">
    <Container
      maxWidth="lg"
    >
      <Box
        sx={{
          mb: 2,
        }}
      >
      </Box>
      <Box>
        <div style={{width: "100%", paddingTop: "48px", paddingBottom: "48px"}}>
          <h6>
            All Projects
          </h6>
          <h2>
            <strong>
              Hi, {localStorage.getItem('username')}🤚
            </strong>
          </h2>
        </div>
        <Grid container spacing={2}>
          {filteredList != null && filteredList.length > 0 &&  filteredList.map((item, index) => {
            // console.log("this is a list item", item.owner[0])
            return (
              <Grid item xs={12} sm={3} md={3} key={item.id}>
                <Card style={{border:"1px solid gray", height:"95%"}}>
                  <CardHeader className="content-center"
                    avatar={
                      <Avatar sx={{ bgcolor: red[500]}} aria-label="recipe" style={{width: "40px", height: "40px"}}>
                        {item.owner.charAt(0).toUpperCase()}
                      </Avatar>
                    }
                    action={
                      <div style={{flexDirection: 'col', alignItems: 'center', paddingTop: "10px", paddingRight: "16px"}}>
                        <Button id = {index} variant="outlined" size = "small" style = {{textAlign: 'center'}} href= {`/apply/${item.id}`} >
                          details
                        </Button>
                      </div>
                    }
                    title={item.owner}
                    subheader={item.start_date}
                  />
                  <CardMedia
                    sx={{ height: 200 }}
                    image={itemImg}
                    title="green iguana"
                  />
                  <CardContent style={{ marginBottom: '16px' }}>
                    <Typography variant="h5" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography variant="body" color="text.secondary" >
                      {item.brief_problem_statement}
                    </Typography>
                    {/* <Typography variant="body3" color="text.secondary">
                      Welcome to our website
                    </Typography> */}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Container>
      <Box sx = {{width:"20%"}} direction="column">
        <Grid>
          { role == 3? null: <RecomProjects/>}
        </Grid>
        <Grid sx={{mt:12}}>
        { (role == 2 || role == 3)? null: <RecomSupervisors/>}
        </Grid>
      </Box>
    </Grid>
    </>
  );
}
