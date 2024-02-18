import React from 'react';
import Header from '../ProtoTemplate/Header';
import './projectname.css';
import banner from '../images/banner.png'

const Projectname = () => {
  return (
    <div>
        <Header/>
        <div className="container flex project">
            <div className='back-btn'>
                <button className='back'>Back</button>
            </div>
            <div className='image'>
                <img className='content'src={banner} alt="banner" />
            </div>
            <div className='projectname'>
                Project Name
            </div>
            <div className='detailedinfo'>
                <div className='ownername'>
                    Owner Name
                </div>
                <div className='date'>
                    <div className='startdate'>
                        Start Date
                    </div>
                    <div className='enddate'>
                        End Date
                    </div>
                </div>
            </div>


            <div className='introduction'>
                Introduction

            </div>
            <div className='requirements'>
                Requirements

            </div>
        </div>



    </div>
  )
}

export default Projectname
