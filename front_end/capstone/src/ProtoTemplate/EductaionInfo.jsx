import React from 'react';
import axios from 'axios';
import InputField from './components/InputField';
import './education.css';
import EditBtnEduInfo from '../ProtoTemplate/components/EditBtnEduInfo'
import { get } from '../AxiosInstance/axiosController';


const EducaionInfo = (props) => {
    const sectionName = props.value.title
    const fields_val = [
        {type: 'text', item:props.value.labelName1},
        {type: 'text', item:props.value.labelName2}
    ]
    // console.log(fields_val)
    var contents = []

    const [educaionInfo, setEducationInfo] = React.useState(null)

    const [newData, setNewData] = React.useState(null)

    React.useEffect(() => {
        get('/api/userEducation').then((response)=> {
            if(response.status === 200) {
                console.log("!!!@#!#!@")
                console.log(response.data)
                if (response.data.code != 200) {
                    setEducationInfo([])
                } else {
                    const maps = response.data.data.map((item) => {
                        return {degree: item.degree, major: item.major}
                      })
                    console.log("here!!!")
                    console.log(maps)
                    setEducationInfo(maps)
                }
            } else {
                console.log('wrong')
            }
        })
    },[newData]);

    if (educaionInfo != null) {
        if (educaionInfo.length == 0) {
            contents = ["", ""]
        }
        for (var i = 0; i < educaionInfo.length; i++) {
            contents = [...contents, educaionInfo[i].major, educaionInfo[i].degree]
        }
    }

  return (
    <div className='container flex education'>
        <div className='educationinfo shadow'>
            <div className='educationtitle'><h3>{sectionName}</h3></div>
            <div className='flex inputFields'>
                {contents.map((element,index) => {
                    if (index % 2 == 0) {
                        console.log(fields_val[0].item)
                        var temp = Object.assign({}, fields_val[0])
                        temp.item = temp.item + parseInt(index / 2 + 1)
                        return <InputField value = "text" key ={index} values = {temp} content = {element}/>
                    } else {
                        var temp = Object.assign({}, fields_val[1])
                        temp.item = temp.item + parseInt(index / 2 + 1)
                        return <InputField value = "text" key ={index} values = {temp} content = {element}/>
                    }
                })}
            </div>
            <EditBtnEduInfo setData = {setNewData}/>
        </div>



    </div>
  )
}

export default EducaionInfo
