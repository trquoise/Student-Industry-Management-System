import React from 'react'
import './tag.css';
import SelectTag from './SelectTag';
import { Button } from '@mui/material';
const Tag = () => {

  return (
    <div className="container flex tag">
            <div className="taginfo shadow">
                <div className="infotitle"><h3>Tag</h3></div>
                <div className='chipsArray'>
                    <SelectTag/>
                </div>
            </div>

    </div>
  )
}

export default Tag
