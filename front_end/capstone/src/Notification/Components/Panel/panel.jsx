import * as React from 'react';
import Button from '@mui/joy/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import AccountDetail from '../../../ProtoTemplate/AccountDetail'
import Tag from '../../../ProtoTemplate/components/Tag'
import { get } from '../../../AxiosInstance/axiosController';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Input from '@mui/joy/Input';
import PropTypes from 'prop-types';
import Rating from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
  
//   export default function RadioGroupRating() {
//     return (

//     );
//   }
  
// import EducationInfo from '../../../ProtoTemplate/EductaionInfo'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
      color: theme.palette.action.disabled,
    },
  }));


export default function Panel(props) {
  const [open, setOpen] = React.useState(props.isopen);
  const [PersonalInfo, setPersonalInfo] = React.useState({})
  const [tags, setTags] = React.useState([])
//   const handleClickOpen = () => {
//     setOpen(true);
//   };

  const handleClose = () => {
    setOpen(false);
    props.handlePanel(false)
  };

  function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
  }

  const customIcons = {
    1: {
      icon: <SentimentVeryDissatisfiedIcon color="error" />,
      label: 'Very Dissatisfied',
    },
    2: {
      icon: <SentimentDissatisfiedIcon color="error" />,
      label: 'Dissatisfied',
    },
    3: {
      icon: <SentimentSatisfiedIcon color="warning" />,
      label: 'Neutral',
    },
    4: {
      icon: <SentimentSatisfiedAltIcon color="success" />,
      label: 'Satisfied',
    },
    5: {
      icon: <SentimentVerySatisfiedIcon color="success" />,
      label: 'Very Satisfied',
    },
  };

  React.useEffect(()=>{
    setOpen(props.isopen);
    fetchTagsData();
    fetchperonInfoData();
    // debugger
  },[props.isopen])

  IconContainer.propTypes = {
    value: PropTypes.number.isRequired,
  };

  const fetchTagsData = () => {
    get('/api/userTags?email='+props.data.applicant_emails).then((response) => {
        // console.log(response)
        if (response.status === 200) {
            // console.log("this is response", response.data.data)
            // console.log("this is his email", props.data.applicant_emails)
            setTags(response.data.data)
            // console.log("openlem",tags)

        } else {
            console.log('wrong')
        }
    })

}

const fetchperonInfoData = () => {
    get('/api/personalInfo?email='+props.data.applicant_emails).then((response) => {
        // console.log(response)
        if (response.status === 200) {
            console.log("this is response", response.data.data)
            // console.log("this is his email", props.data.applicant_emails)
            setPersonalInfo(response.data.data)
        } else {
            console.log('wrong')
        }
    })

}

  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open dialog
      </Button> */}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Applicant Information
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers sx={{maxHeight: '70vh', overflow: 'auto'}}>
        <Typography variant='h7'>
                Applicant Basic Infomation
            </Typography>
            <Divider/>
            <FormControl sx={{mt:2}}>
                <FormLabel>applicant name</FormLabel>
                <Input placeholder={PersonalInfo.name} disabled/>
            </FormControl>
            <FormControl>
                <FormLabel sx={{mt:1.5}}>applicant location</FormLabel>
                <Input placeholder={PersonalInfo.location} disabled />
            </FormControl>
            <FormControl>
                <FormLabel sx={{mt:1.5}}>applicant Phonenumber</FormLabel>
                <Input placeholder={PersonalInfo.phone} disabled />
                {/* <FormHelperText>This is a helper text.</FormHelperText> */}
            </FormControl>

            <Typography variant='h7'>
                Average Ratings:{PersonalInfo.average_rate}({PersonalInfo.rate_num} times)
            </Typography>
            <StyledRating
                name="highlight-selected-only"
                value={parseInt(PersonalInfo.average_rate)}
                IconContainerComponent={IconContainer}
                highlightSelectedOnly
                readOnly
                sx={{mt:3}}
            />
            <Typography variant='h6'sx={{mt:2}}>
                Tags
            </Typography>
            <Divider/>
            {tags.map((items, index)=>{
                // console.log(items)
                return(
                    <>
                    <Button size="sm" sx={{ml:1, mt:1}} key={index}>{items.tag_name}</Button>
                    </>
                )
            })}

        </DialogContent>
        {/* <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions> */}
      </BootstrapDialog>
    </React.Fragment>
  );
}
