import React from 'react'
import TextField from '@mui/material/TextField';
import './TextField.css'

const TextFields = (props) => {
  return (
    <div className='inputField flex'>
        <div className='left'>
            <label htmlFor="">{props.values.item}</label>
        </div>
        <div className='right'>
            <TextField className= {props.values.item} type={props.values.type} value= {props.content}  InputProps={{
              readOnly: true,
            }}/>
        </div>
    </div>
  )
}

export default TextFields