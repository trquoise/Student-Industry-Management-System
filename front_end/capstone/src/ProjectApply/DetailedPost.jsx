import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import {Grid} from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import styles from './DetailedPost.module.css';
import RecomSupervisors from '../ProtoTemplate/components/RecomSupervisors'
import RecomStudents from '../ProtoTemplate/components/RecomStudents';


function convertToDateObject(dateStr) {
  const parts = dateStr.split('-');
  return new Date(`${parts[1]}-${parts[0]}-${parts[2]}`);
}

export default function BasicTextFields() {
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [applyStartDate, setApplyStartDate] = React.useState(new Date());
  const [applyEndDate, setApplyEndDate] = React.useState(new Date());
  const [openDialog, setOpenDialog] = React.useState(false);
  const [requiredSkills, setRequiredSkills] = React.useState([]);

  const userRole = localStorage.getItem('role');
  const industryName = localStorage.getItem('username');

  const navigate = useNavigate();
  const param = useParams()
  const target_project_id = param.project_id
  console.log(target_project_id)

  const handleOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };


  const handleEditProfile = () => {
    const userRole = localStorage.getItem('role');

    switch (userRole) {
      case '1':
        navigate('/studentportfolio');
        break;
      case '2':
        navigate('/supervisorportfolio');
        break;
      case '3':
        navigate('/industryportfolio');
        break;
      default:
        console.error('Unknown user role:', userRole);
    }
  };

  const [applySuccessDialog, setApplySuccessDialog] = React.useState(false);

  const handleCloseAndOpenSuccess = () => {
    setOpenDialog(false);
    setApplySuccessDialog(true);
  };

  const handleCloseSuccess = () => {
    setApplySuccessDialog(false);
  };

  const [projectId, setProjectId] = React.useState(null);


  const [data, setData] = React.useState({
    industryName: "",
    projectName: "",
    academicSupervisor: "",
    briefInformation: "",
    expectedOutcomes: "",
    numberOfCandidates: "",
    potentialDeliverables: "",
    
  });

  React.useEffect(() => {
    fetch("/api/project", {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then((response) => response.json())
      .then((res) => {
        if (res && res.length > 0) {
          const project = res.find(p => p.id.toString() === target_project_id);
          console.log("this is the project", res)

          if (project) {
            setData({
              industryName: project.owner || "",
              projectName: project.name || "",
              academicSupervisor: project.academic_researcher || "",
              briefInformation: project.brief_problem_statement || "",
              expectedOutcomes: project.desired_outcomes || "",
              numberOfCandidates: project.num_of_candidate || "",
              potentialDeliverables: project.potential_deliverables || ""
            
            });
            const skillsArray = project.required_skills.split(',').map(skill => skill.trim());
            setRequiredSkills(skillsArray);
            setStartDate(convertToDateObject(project.project_start_date));
            setEndDate(convertToDateObject(project.project_end_date));
            setApplyStartDate(convertToDateObject(project.apply_start_date));
            setApplyEndDate(convertToDateObject(project.apply_end_date));
            setProjectId(project.id);
          } else {
            console.error("Project not found with ID:", target_project_id);
          }
        }
      })
      .catch((error) => console.error("Error:", error));
}, [target_project_id]);
      


  const handleSubmit = () => {
    if (userRole === '3') {
      alert("Sorry, industry partner cannot apply.");
      return;
    }
    if (projectId != null) {
      fetch("/api/projectApplication", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ project_id: projectId })
      })
      .then(response => {
        if (response.status === 200) {
          handleCloseAndOpenSuccess();
        } else {
          console.error('Application failed with status:', response.status);
        }
      })
      .catch((error) => console.error("Error:", error));
    } else {
      console.error("Project ID is null");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} >
      <Box className={styles.containerStyle} noValidate autoComplete="off">
        <Box className={styles.boxStyle}>
          <TextField id="Industry-Name" label="Industry Name" variant="outlined" value={data.industryName} className={styles.textfieldStyle} />
          <TextField id="Project-Name" label="Project Name" variant="outlined" value={data.projectName}  className={styles.textfieldStyle} />
          <TextField id="Academic-Supervisor" label="Academic Supervisor" variant="outlined" value={data.academicSupervisor}  className={styles.textfieldStyle} />
          <TextField id="Brief-Information" label="Brief Information" multiline rows={4} variant="outlined" value={data.briefInformation}  className={styles.textfieldStyle} />
          <Box className={styles.datePickerBox}>
            <DatePicker
              label="Project Start Date"
              value={startDate}
              onChange={(newDate) => setStartDate(newDate)}
              renderInput={(params) => <TextField {...params} helperText={null} disabled/>}
              readOnly
            />
            <DatePicker
              label="Project End Date"
              value={endDate}
              onChange={(newDate) => setEndDate(newDate)}
              renderInput={(params) => <TextField {...params} helperText={null} disabled/>}
              readOnly
            />
          </Box>
          <TextField id="Expected-outcomes" label="Expected outcomes" variant="outlined" value={data.expectedOutcomes}  className={styles.textfieldStyle} />
          <Box className={styles.datePickerBox}>
            <DatePicker
              label="Apply Start Date"
              value={applyStartDate}
              onChange={(newDate) => setApplyStartDate(newDate)}
              renderInput={(params) => <TextField {...params} helperText={null} disabled/>}
              readOnly
            />
            <DatePicker
              label="Apply End Date"
              value={applyEndDate}
              onChange={(newDate) => setApplyEndDate(newDate)}
              renderInput={(params) => <TextField {...params} helperText={null} disabled/>}
              readOnly
            />
          </Box>
          <TextField id="Number-of-Candidates" label="Number of Candidates" type="number" variant="outlined" value={data.numberOfCandidates}  className={styles.textfieldStyle} />
          <TextField id="Potential-Deliverables" label="Potential Deliverables" multiline rows={4} variant="outlined" value={data.potentialDeliverables}  className={styles.textfieldStyle} />
          <TextField
            id="Required-skills"
            label="Required Skills"
            multiline rows={4}
            variant="outlined"
            value={requiredSkills.join(', ')} 
            className={styles.textfieldStyle}
            InputProps={{
              readOnly: true,
            }}
          />
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Apply
          </Button>
 

        </Box >
        {data.industryName === industryName && (
          <Grid className={styles.recommendContainer}>
            <RecomSupervisors projectId={target_project_id}/>
            <RecomStudents projectId={target_project_id}/>
          </Grid>
         
        )}
      </Box>
      <Dialog open={openDialog} onClose={handleClose} aria-labelledby="apply-dialog-title">
             <DialogTitle id="apply-dialog-title">Do you want to send your current profile to the owner?</DialogTitle>
             <DialogContent>
                 <Button color="primary" onClick={handleEditProfile }>
                    Edit Your Profile
                 </Button>
             </DialogContent>
             <DialogActions>
                 <Button onClick={handleSubmit} color="primary">
                    Submit
                 </Button>
             </DialogActions>
       </Dialog>
       <Dialog open={applySuccessDialog} onClose={handleCloseSuccess} aria-labelledby="apply-success-dialog-title">
              <DialogTitle id="apply-success-dialog-title">Apply success</DialogTitle>
              <DialogContent>

              </DialogContent>
              <DialogActions>
              <Button onClick={handleCloseSuccess} color="primary">
                     OK
              </Button>
              </DialogActions>
        </Dialog>
    </LocalizationProvider>
  );
}
