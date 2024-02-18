import {
  Container,
  Button,
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Chip,
  Stack,
  Paper,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import { styled } from '@mui/material/styles';
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import Header from '../ProtoTemplate/Header'

export default function Com() {
  const navigate = useNavigate();
  const [candidateNum, setCandidateNum] = useState(0)
  const [projectName, setProjectName] = useState("");
  const [briefInformation, setBriefInformation] = useState("");
  const [desiredOutcomes, setDesiredOutcomes] = useState("");
  const [potentialDeliverables, setPotentialDeliverables] = useState("");
  const [skillName, setSkillName] = useState("");
  const [skillArray, setSkillArray] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [applyStartDate, setApplyStartDate] = useState(new Date());
  const [applyEndDate, setApplyEndDate] = useState(new Date());
  var username = localStorage.getItem('username')


  const Item = styled(Paper)(({ theme }) => ({

  }));

  const handleAddSubmit = async () => {
    if (!projectName) {
      alert("Project Name cannot be empty!");
      return;
    }
    if (!briefInformation) {
      alert("Brief Information cannot be empty!");
      return;
    }
    if (!desiredOutcomes) {
      alert("Desired Outcomes cannot be empty!");
      return;
    }
    if (!candidateNum) {
      alert("Number of candidates cannot be 0!");
      return;
    }
    if (!potentialDeliverables) {
      alert("Potential Deliverables cannot be empty!");
      return;
    }

    const formData = (date) =>{
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      return `${day}-${month}-${year}`;

    }

    let postData = {
      owner_username: username,
      num_of_candidate: candidateNum,
      project_name: projectName,
      potential_deliverables: potentialDeliverables,
      desired_outcomes: desiredOutcomes,
      brief_problem_statement: briefInformation,
      apply_start_date: formData(applyStartDate),
      apply_end_date: formData(applyEndDate),
      project_start_date: formData(startDate),
      project_end_date: formData(endDate),
      required_skills: skillArray
        .map((v) => {
          return v.title;
        })
        .join(","),
    };
    console.log("postData = ", postData);
    fetch("/api/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((res) => {
        console.log("res data = ", res)
        navigate('/')
      })
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {}, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Header/>
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item style={{paddingTop:"20px"}}>
            <Typography component="h1" variant="h5">
              Create Project
            </Typography>
          </Grid>
          <Grid item>
            <Grid container justifyContent="space-between" alignItems="center">
              {/*<Button*/}
              {/*  variant="contained"*/}
              {/*  sx={{ ml: 1 }}*/}
              {/*  onClick={handleAddSubmit}*/}
              {/*>*/}
              {/*  Create*/}
              {/*</Button>*/}
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          mb: 4,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <Card>
              <CardContent>
                <FormControl fullWidth>
                  <TextField
                    required
                    margin="normal"
                    label="Project Name"
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={projectName}
                    onChange={(e) => {
                      setProjectName(e.target.value);
                    }}
                  />
                </FormControl>
                <Grid container spacing={20} item = {true}>
                  <Grid xs = {4} item = {true}>
                    <DatePicker
                      label="Project Start Date"
                      value={startDate}
                      onChange={(newDate) => setStartDate(newDate)}
                      renderInput={(params) => <TextField {...params} helperText={null} />}
                    />
                  </Grid>
                  <Grid xs = {4} item = {true}>
                  <DatePicker
                      label="Project End Date"
                      value={endDate}
                      onChange={(newDate) => setEndDate(newDate)}
                      renderInput={(params) => <TextField {...params} helperText={null} />}
                    />
                  </Grid>
                </Grid>

                <FormControl fullWidth>
                  <TextField
                    required
                    margin="normal"
                    label="number of candidates"
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={candidateNum}
                    onChange={(e) => {
                      setCandidateNum(e.target.value);
                    }}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    required
                    multiline
                    rows={2}
                    margin="normal"
                    label="Brief Information"
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={briefInformation}
                    onChange={(e) => {
                      setBriefInformation(e.target.value);
                    }}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    required
                    multiline
                    rows={2}
                    margin="normal"
                    label="Desired Outcomes"
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={desiredOutcomes}
                    onChange={(e) => {
                      setDesiredOutcomes(e.target.value);
                    }}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    required
                    multiline
                    rows={2}
                    margin="normal"
                    label="Potential Deliverables"
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={potentialDeliverables}
                    onChange={(e) => {
                      setPotentialDeliverables(e.target.value);
                    }}
                  />
                </FormControl>
                <Grid container spacing={20} item = {true}>
                  <Grid xs = {4} item = {true}>
                    <DatePicker
                      label="Project Apply Start Date"
                      value={applyStartDate}
                      onChange={(newDate) => setApplyStartDate(newDate)}
                      renderInput={(params) => <TextField {...params} helperText={null} />}
                    />
                  </Grid>
                  <Grid xs = {4} item = {true}>
                  <DatePicker
                      label="Project Apply End Date"
                      value={applyEndDate}
                      onChange={(newDate) => setApplyEndDate(newDate)}
                      renderInput={(params) => <TextField {...params} helperText={null} />}
                    />
                  </Grid>
                </Grid>
                <Card>
                  <CardHeader
                    title={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography component="h1" variant="h5">
                          Required Skills
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <TextField
                            label="Skill Name"
                            size="small"
                            variant="outlined"
                            value={skillName}
                            onChange={(e) => {
                              setSkillName(e.target.value);
                            }}
                          />
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => {
                              if (!skillName) {
                                alert("Please enter Skill Name!");
                                return;
                              }
                              const deepSkillsArray = [...skillArray];
                              deepSkillsArray.push({
                                title: skillName,
                              });
                              setSkillArray(deepSkillsArray);
                              setSkillName("");
                            }}
                          >
                            Add A Skill
                          </Button>
                        </Stack>
                      </Box>
                    }
                  />
                  <CardContent>
                    <Stack direction="row" spacing={1}>
                      {skillArray.map((item, index) => {
                        return (
                          <Chip
                            key={index}
                            label={item.title}
                            onDelete={() => {
                              const deepSkillsArray = [...skillArray];
                              deepSkillsArray.splice(index, 1);
                              setSkillArray(deepSkillsArray);
                            }}
                          />
                        );
                      })}
                    </Stack>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
          </Grid>
          <Grid item>
            <Grid container justifyContent="space-between" alignItems="center">
              <Button
                variant="contained"
                sx={{ ml: 1 }}
                onClick={handleAddSubmit}
              >
                Create
              </Button>
            </Grid>
          </Grid>
        </Grid>
    </Container>
    </LocalizationProvider>
  );
}
