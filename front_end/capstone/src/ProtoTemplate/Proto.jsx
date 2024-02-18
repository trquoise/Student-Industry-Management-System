import React from 'react'
import Header from './Header.jsx'
import PersonalInfo from './PersonalInfo.jsx'
import EductaionInfo from './EductaionInfo.jsx'
import ProjectExp from './ProjectExp.jsx'
import Resume from './components/Resume.jsx'
import AccountDetail from './AccountDetail.jsx'
import Tag from './components/Tag.jsx'


const data = {labelName1:'Major', labelName2:'Degree',title:'Education'}


const Proto = (props) => {
  return (
    <div>
      <Header/>
      <AccountDetail/>
      <PersonalInfo/>
      <EductaionInfo value = {data}/>
      <ProjectExp/>
      <Tag/>
      <Resume value = {props.value}/>
    </div>
  )
}

export default Proto

