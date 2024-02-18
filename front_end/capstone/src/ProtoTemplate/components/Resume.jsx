import React from 'react'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';import './resume.css';
import axios from 'axios';
import {post} from '../../AxiosInstance/axiosController'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const   Resume = (props) => {
  const title = props.value.fileSectionName
  const [filename, setFilename] = React.useState("")

  const handleFileUpload = (e)=> {
    console.log(e)
    if (!e.target.files) {
      return;
    }
    console.log(e.target.files)
    const file = e.target.files[0];
    const formData = new FormData()
    formData.append('resume_file', file);
    const results = fetch('/api/studentResume', {
      headers: {'Authorization': "Bearer " + localStorage.getItem('token')},
      method: 'POST',
      body: formData
    }).then((r) => {
      if (r.status == 200) {
        alert("File uploaded!")
        setFilename(file.name)
      }
    });
  }

  return (
    <div className="container flex resume">
            <div className="resumeinfo shadow">
                <div className="infotitle"><h3>{title}</h3></div>
                 {
                    filename.length > 0 &&
                    <div style={{margin: 'auto', justifyContent:'center', display:'flex', alignItems: 'center'}}>
                      <InsertDriveFileIcon/>
                     <h3>{filename}</h3>
                    </div>
                 }

                <div className='container flex'>
                  <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                      Upload Resume PDF
                      <input type="file" accept=".pdf" hidden onChange={handleFileUpload} />
                  </Button>
                </div>
            </div>

    </div>
  )
}

export default Resume
