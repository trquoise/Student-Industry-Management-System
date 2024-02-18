import React from 'react';
import axios from 'axios';
import './personalInfo.css';
import InputField from './components/InputField';
import {post, get} from '../AxiosInstance/axiosController'
import TextFields from './components/TextField';


const AccountDetail = () => {
  const fields_val = [
        {type: 'text', item: 'Username'},
        {type: 'text', item: 'Email'},
  ]

  var contents = [localStorage.getItem('username'), localStorage.getItem('email')]

  const [accountDetail, setAccountDetail] = React.useState(null)

  return (
    <div className="container flex personal">
            <div className="personalinfo shadow">
                <div className="infotitle"><h3>Account Detail</h3></div>
                <div className='flex inputFields '>
                    {
                        fields_val.map((item, index) => {
                          return <TextFields values = {item} key={index} content = {contents[index]} />
                        })
                    }
                 </div>
            </div>


    </div>
  )
}

export default AccountDetail
