import React from 'react';
import axios from 'axios';
import InputField from '../ProtoTemplate/components/InputField';
import './companyinfo.css';
import EdiBtnCompInfo from '../ProtoTemplate/components/EditBtnCompInfo'
import {get} from '../AxiosInstance/axiosController'

const Companyinfo = (props) => {
    const sectionName = props.value.title
    const fields_val = [
        {type: 'text', item:props.value.labelName1},
        {type: 'text', item:props.value.labelName2}
    ]
    console.log(fields_val)
    var contents = []

    const [companyInfo, setCompanyInfo] = React.useState(null)

    const [newData, setNewData] = React.useState(null)

    React.useEffect(() => {
        get('/api/company').then((response)=> {
            if(response.status === 200) {
                if (response.data.code != 200) {
                    setCompanyInfo({company_name: '', company_area:''})
                } else {
                    console.log(response.data.data)
                    setCompanyInfo(response.data.data)
                }
            } else {
                console.log('wrong')
            }
        })
    },[newData]);

    if (companyInfo != null) {
        contents = [companyInfo.company_name, companyInfo.company_area]
        if (companyInfo.company_name == null && companyInfo.company_area == null) {
            contents = ['', '']
        }
    }

  return (
    <div className='container flex education'>
        <div className='educationinfo shadow'>
            <div className='educationtitle'><h3>{sectionName}</h3></div>
            <div className='flex inputFields'>
                {fields_val.map((item,index) => {
                    console.log(item)
                    return <InputField values = {item} key ={index} content = {contents[index]}/>
                })}
            </div>
            <EdiBtnCompInfo setData = {setNewData}/>
        </div>



    </div>
  )
}

export default Companyinfo