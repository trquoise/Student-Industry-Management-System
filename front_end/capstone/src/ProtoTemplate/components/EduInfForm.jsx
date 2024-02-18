import React from 'react';
import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
import './form.css';
import axios from 'axios';
import { response } from 'msw';


const EduInfForm = (props) => {
    var contents = []

    // const [eduInfForm, setEduInfForm] = React.useState(null)

    var eduInfForm = {}
    console.log(props.info)
    if (props.info != null) {
        eduInfForm = props.info
    } else {
        eduInfForm = {
            major : "",
            degree: ""
        }
    }

    const  {
            register,
            handleSubmit,
            setValue,
            formState:{errors}
    } = useForm({
        defaultValues: {
            Major: eduInfForm.major,
            Degree: eduInfForm.degree,
        }
    });


    const setMajor = (e) => {
        eduInfForm.major = e.target.value
        var educaionInfo = JSON.parse(localStorage.getItem('educationInfo'))
        console.log(educaionInfo)
        educaionInfo[props.index] = eduInfForm
        localStorage.setItem('educationInfo', JSON.stringify([...educaionInfo]))
        console.log(localStorage.getItem('educationInfo'))
    }

    const setDegree = (e) => {
        eduInfForm.degree = e.target.value
        var educaionInfo = JSON.parse(localStorage.getItem('educationInfo'))
        educaionInfo[props.index] = eduInfForm
        localStorage.setItem('educationInfo', JSON.stringify([...educaionInfo]))
        console.log(localStorage.getItem('educationInfo'))
    }


    return (
        <div className='container'>
            <div className='form'>
                <form onSubmit = {handleSubmit((data) => {
                    console.log(data)

                })}>
                    <div className='form-row'>
                        <div className='left'>
                            <label>Major</label>
                        </div>
                        <div className='right'>
                            <input {...register("Major",{required:'This is required.'}) } placeholder ="Major" onChange={setMajor}/>
                            <p>{errors.Major?.message}</p>
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='left'>
                            <label>Degree</label>
                        </div>
                        <div className='right'>
                            <input {...register("Degree",{required:'This is required.'}) } placeholder ="Degree" onChange={setDegree}/>
                            <p>{errors.Degree?.message}</p>
                        </div>
                    </div>

                </form>
            </div>

        </div>
    )
}

export default EduInfForm