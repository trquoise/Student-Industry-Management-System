import React from 'react'
import axios from 'axios'
import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
import './personalInfForm.css'
import { response } from 'msw';
import {get} from "../../AxiosInstance/axiosController"



const PersonalInfForm = () => {

    var contents = []
    var personalInfo = {name: "", location: "", phone: "", personal_summary: ""}

    const [personalInfForm, setPersonalInfForm] = React.useState(null)

    const  {
        register,
        handleSubmit,
        setValue,
        formState:{errors}
    } = useForm({
    defaultValues: {
        Name: '',
        Location:'',
        Phonenumber: '',
        Personalsummary: ''
    }
    });


    React.useEffect(() => {

        get('/api/personalInfo').then((response) => {
          if (response.status === 200) {
            if(response.data.code === 200) {
                setPersonalInfForm(response.data.data)
            } else {
                setPersonalInfForm(personalInfo)
            }
          } else {
              console.log('wrong')
          }
      })
    }, []);


    if (personalInfForm != null) {
        contents = Object.values(personalInfForm)
        setValue("Name", personalInfForm.name);
        setValue("Location", personalInfForm.location);
        setValue("Phone", personalInfForm.phone);
        setValue("Personalsummary", personalInfForm.personal_summary);
    }

    const setName = (e)=> {
        personalInfForm.name = e.target.value
        setPersonalInfForm(personalInfForm)
        localStorage.setItem('personalInfo', JSON.stringify(personalInfForm))
        console.log(localStorage.getItem('personalInfo'))
    }

    const setLocation = (e)=> {
        personalInfForm.location = e.target.value
        setPersonalInfForm(personalInfForm)
        localStorage.setItem('personalInfo', JSON.stringify(personalInfForm))
        console.log(localStorage.getItem('personalInfo'))
    }

    const setPhoneNumber = (e)=> {
        personalInfForm.phone = e.target.value
        setPersonalInfForm(personalInfForm)
        localStorage.setItem('personalInfo', JSON.stringify(personalInfForm))
        console.log(localStorage.getItem('personalInfo'))
    }
    const setIntroduction = (e)=> {
        personalInfForm.personal_summary = e.target.value
        setPersonalInfForm(personalInfForm)
        localStorage.setItem('personalInfo', JSON.stringify(personalInfForm))
        console.log(localStorage.getItem('personalInfo'))
    }

    return (
        <div className='container'>
            <div className='form' id='personal-info-form'>
                <form onSubmit = {handleSubmit((data) => {
                    console.log("here is data")
                    console.log(data)
                })}>
                    <div className='form-row'>

                        <div className='left'>
                             <label>Name</label>
                        </div>
                        <div className='right'>
                            <input {...register("Name",{required:'This is required.'})} onChange={setName}/>
                            <p>{errors.Name?.message}</p>
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='left'>
                            <label>Location</label>
                        </div>
                        <div className='right'>
                            <input {...register("Location",{required:'This is required.'})} onChange= {setLocation} />
                            <p>{errors.location?.message}</p>
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='left'>
                            <label>Phone number</label>
                        </div>
                        <div className='right'>
                            <input {...register("Phone",{required:'This is required.'}) } onChange= {setPhoneNumber} />
                            <p>{errors.Phonenumber?.message}</p>
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='left'>
                            <label>Personal Introduction</label>
                        </div>
                        <div className='right'>
                            <textarea {...register("Personalsummary",{required:'This is required.'}) } placeholder ="Summary" onChange = {setIntroduction}/>
                            <p>{errors.Personalsummary?.message}</p>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default PersonalInfForm
