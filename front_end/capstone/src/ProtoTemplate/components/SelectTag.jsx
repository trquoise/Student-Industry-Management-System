import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { Button } from '@material-ui/core';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TagForm from './TagForm';
import { get, post } from '../../AxiosInstance/axiosController';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();
const default_data =  [
  { "value": "ReactJSDeveloper", "label": "React JS Developer" },
  { "value": "PythonProgrammer", "label": "Python Programmer" },
  { "value": "JavaCertified", "label": "Java Certified" },
  { "value": "CybersecuritySpecialist", "label": "Cybersecurity Specialist" },
  { "value": "CloudComputingAWS", "label": "Cloud Computing AWS" },
  { "value": "SQLDatabaseExpert", "label": "SQL Database Expert" },
  { "value": "MachineLearningEnthusiast", "label": "Machine Learning Enthusiast" },
  { "value": "MobileAppDevAndroid", "label": "Mobile App Dev Android" },
  { "value": "FullStackWebDev", "label": "Full Stack Web Dev" },
  { "value": "UXUIDesigner", "label": "UX/UI Designer" },
  { "value": "BlockchainTechnologist", "label": "Blockchain Technologist" },
  { "value": "DataAnalystTableau", "label": "Data Analyst Tableau" },
  { "value": "CollaborativeWorking", "label": "Collaborative Working" },
  { "value": "CrossFunctionalTeamwork", "label": "Cross-Functional Teamwork" },
  { "value": "EffectiveCommunication", "label": "Effective Communication" },
  { "value": "ConflictResolution", "label": "Conflict Resolution" },
  { "value": "PeerMediation", "label": "Peer Mediation" },
  { "value": "AdaptabilityInTeams", "label": "Adaptability in Teams" },
  { "value": "ProblemSolvingTeamwork", "label": "Problem-Solving Teamwork" },
  { "value": "ProjectManagement", "label": "Project Management" },
  { "value": "LeadershipSkills", "label": "Leadership Skills" },
  { "value": "InterpersonalSkills", "label": "Interpersonal Skills" },
  { "value": "CulturalAwareness", "label": "Cultural Awareness" },
  { "value": "TeamMotivation", "label": "Team Motivation" },
  { "value": "DecisionMaking", "label": "Decision Making" },
  { "value": "TeamBuildingActivities", "label": "Team Building Activities" },
  { "value": "DelegationSkills", "label": "Delegation Skills" },
  { "value": "ConstructiveFeedback", "label": "Constructive Feedback" },
  { "value": "ListeningSkills", "label": "Listening Skills" },
  { "value": "TimeManagementInTeams", "label": "Time Management in Teams" },
  { "value": "NegotiationSkills", "label": "Negotiation Skills" },
  { "value": "EmotionalIntelligence", "label": "Emotional Intelligence" },
  { "value": "InnovationInTeams", "label": "Innovation in Teams" },
  { "value": "TeamPlanning", "label": "Team Planning" },
  { "value": "CoachingAndMentoring", "label": "Coaching and Mentoring" },
  { "value": "TeamworkUnderPressure", "label": "Teamwork Under Pressure" },
  { "value": "RemoteTeamCollaboration", "label": "Remote Team Collaboration" },
  { "value": "NoExperience", "label": "No Experience" },
  { "value": "InternshipExperience", "label": "Internship Experience" },
  { "value": "UnderOneYearExperience", "label": "Under 1 Year Experience" },
  { "value": "OneYearExperience", "label": "1 Year Experience" },
  { "value": "TwoYearsExperience", "label": "2 Years Experience" },
  { "value": "ThreeYearsExperience", "label": "3 Years Experience" },
  { "value": "CoopExperience", "label": "Co-op Experience" },
  { "value": "ResearchAssistantExperience", "label": "Research Assistant Experience" },
  { "value": "PartTimeExperience", "label": "Part-Time Experience" },
  { "value": "VolunteerExperience", "label": "Volunteer Experience" },
  { "value": "ProjectBasedExperience", "label": "Project-Based Experience" },
  { "value": "FreelanceExperience", "label": "Freelance Experience" },
  { "value": "WorkStudyExperience", "label": "Work-Study Experience" },
  { "value": "ExtracurricularLeadership", "label": "Extracurricular Leadership" },
  { "value": "StudentOrganizationInvolvement", "label": "Student Organization Involvement" },
  { "value": "CapstoneProjectExperience", "label": "Capstone Project Experience" },
  { "value": "SummerJobExperience", "label": "Summer Job Experience" },
  { "value": "StudyAbroadExperience", "label": "Study Abroad Experience" },
  ]


const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function SelectTag() {
  const [option, setOption] = React.useState(default_data);
  const [select, setSelect] = React.useState([])
  const [open, setOpen] = React.useState(false);
  const [flag, setFlag] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    get('/api/userTags').then((response) => {
        if (response.status === 200) {

            const data = response.data.data
            console.log(response)
            if (data.length > 0) {
              const options = data.map((item) => {
                return {value: item.tag_name, label: item.tag_name}
              })
              setSelect(options)
              // setOption([...default_data, options])
            }
            setFlag(true)
        } else {
            console.log('wrong')
        }
    })
  }, []);

  const handleSubmit = () => {
    if (localStorage.getItem('new_tag') != null && localStorage.getItem('new_tag') != '') {
        const new_tag = {
            value : localStorage.getItem('new_tag'),
            label : localStorage.getItem('new_tag'),
        }
        console.log(new_tag)
        const newOptions = [...option, new_tag]
        setOption(newOptions)
        window.alert("New tag is added.")
        handleClose()
    }
  }

  const handleSave = () =>{

    const data = []
    for (var i = 0; i < select.length; i++) {
      data.push({tag_name : select[i].value})
    }

    console.log(data)

    post('/api/userTags', {data: data}).then((response) => {
        console.log(response)
    }).catch((error) => {
        console.log(error)
    });
    window.alert("User tags has updated.")
  }

  return (
    <>
    { (select.length > 0 || flag == true) &&
      <>
      <div style={{width: '70%', marginRight: "20px"}}>
            <Select
            sx = {{width: "30%"}}
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={select}
            isMulti
            options={option}
            onChange={(e)=>setSelect(e)}
          />
        </div>
        <Button variant="contained" color="primary" onClick={handleClickOpen} style={{height:"50px"}}>Add Tag</Button>
        <Button style = {{marginLeft: '20px',height:"50px"}} variant="contained" color="primary" onClick={handleSave}>Save</Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth = "true">
            <DialogTitle id="form-dialog-title">Edit Tage</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Edit your personal Information
            </DialogContentText>
            <TagForm/>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
                Submit
            </Button>
            </DialogActions>
        </Dialog>
      </>
    }
    </>
  );
}