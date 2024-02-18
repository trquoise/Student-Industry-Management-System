import React from 'react'
import Header from '../ProtoTemplate/Header'
import PersonalInfo from '../ProtoTemplate/PersonalInfo'
import Companyinfo from './Companyinfo'
import Companyintroduction from './Companyintroduction'
import Resume from '../ProtoTemplate/components/Resume'
import AccountDetail from '../ProtoTemplate/AccountDetail'
import Tag from '../ProtoTemplate/components/Tag'

const data = {fileSectionName : 'Registration of Certificate'}

const companyData = {labelName1:'Name', labelName2:'Area',title:'Company'}
const Industryporto = () => {
  return (
    <div>
        <Header/>
        <AccountDetail/>
        <PersonalInfo/>
        <Companyinfo value = {companyData}/>
        <Companyintroduction/>
        <Tag/>
        <Resume value = {data}/>


    </div>
  )
}

export default Industryporto
