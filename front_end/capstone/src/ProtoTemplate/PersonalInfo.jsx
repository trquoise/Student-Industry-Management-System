import React from 'react';
import axios from 'axios';
import './personalInfo.css';
import InputField from './components/InputField';
import EditBtnPersonalInfo from '../ProtoTemplate/components/EditBtnPersonalInfo'
import {get} from "../AxiosInstance/axiosController"



const PersonalInfo = () => {
  const fields_val = [
        {type: 'text', item: 'Name'},
        {type: 'text', item: 'Location'},
        {type: 'text', item: 'Phone number'},
        {type: 'textarea', item: 'Introduction'}
  ]

  var contents = []

  const [personalInfo, setPersonalInfo] = React.useState(null)

  const [newData, setNewData] = React.useState(null);

  React.useEffect(() => {
    get('/api/personalInfo').then((response)=> {
          if (response.status === 200) {
            if(response.data.code === 400) {
              setPersonalInfo({name: '', location: '', phone: '', personal_summary: ''})
            } else {
              console.log(response.data.data)
              setPersonalInfo(response.data.data)
            }
          } else {
              console.log('wrong')
          }
      })
  }, [newData]);


  if (personalInfo != null) {
    contents = [personalInfo.name, personalInfo.location, personalInfo.phone, personalInfo.personal_summary]
  }

  return (
    <div className="container flex personal">
            <div className="personalinfo shadow">
                <div className="infotitle">
                  <h3>Personal Information</h3>
                  {
                    localStorage.getItem('role') != 3 && personalInfo != null && personalInfo.average_rate != null &&
                    personalInfo.average_rate != 0 &&
                    <h4>Average Rate: {personalInfo.average_rate}</h4>
                  }
                  {
                    localStorage.getItem('role') != 3 && personalInfo != null && personalInfo.average_rate != null &&
                    personalInfo.average_rate == 0 &&
                    <h4>Average Rate: - </h4>
                  }
                  {
                    localStorage.getItem('role') != 3 && personalInfo != null && personalInfo.rate_num != null &&
                    <h4>Number of Rating: {personalInfo.rate_num}</h4>
                  }
                </div>

                <div className='flex inputFields '>
                    {
                        fields_val.map((item, index) => {
                          return <InputField values = {item} key={index} content = {contents[index]}/>
                        })
                    }
                 </div>
                 <EditBtnPersonalInfo setData = {setNewData}/>
            </div>


    </div>
  )
}

export default PersonalInfo
