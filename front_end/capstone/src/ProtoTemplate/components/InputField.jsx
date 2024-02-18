import React from 'react'

import './inputField.css'

const InputField = (props) => {
  return (
    <div className='inputField flex'>
        <div className='left'>
            <label htmlFor="">{props.values.item}</label>
        </div>
        <div className='right'>
            <input className= {props.values.item} type={props.values.type} value= {props.content} />
        </div>
    </div>
  )
}

export default InputField
