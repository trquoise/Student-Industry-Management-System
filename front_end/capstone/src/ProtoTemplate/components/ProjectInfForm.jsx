import React from 'react'
import { useForm } from "react-hook-form";
import { useState } from 'react';
import './form.css'


const ProjectInfForm = (props) => {

    var projectInfo = {}

    var valid_date = {}

    if (props.info != null) {
        projectInfo = props.info
        const dateFormat =/^(\d{2})-(\d{2})-(\d{4})$/;
        if (dateFormat.test(projectInfo.start_date)) {
            const val = projectInfo.start_date.split("-").reverse().join("-");
            valid_date.start_date = val
        } else {
            valid_date.start_date = projectInfo.start_date
        }

        if (dateFormat.test(projectInfo.end_date)) {
          const val = projectInfo.end_date.split("-").reverse().join("-");
          valid_date.end_date = val
        } else {
            valid_date.end_date = projectInfo.end_date
        }
    } else {
        projectInfo = {
            project_name: "",
            discipline: "",
            start_date: "",
            end_date: "",
        }
    }
    const  {
            register,
            handleSubmit,
            formState:{errors}
    } = useForm({
        defaultValues: {
            ProjectName: projectInfo.project_name,
            Discipline: projectInfo.discipline,
            StartDate: valid_date.start_date,
            EndDate: valid_date.end_date
        }
    });

    const updateLocalStorage = (data) => {
        var proInfo = JSON.parse(localStorage.getItem('projectInfo'))
        proInfo[props.index] = data
        localStorage.setItem('projectInfo', JSON.stringify([...proInfo]))
        console.log(localStorage.getItem('projectInfo'))
    }

    const setProjectName = (e) => {
        projectInfo.project_name = e.target.value
        updateLocalStorage(projectInfo)
    }

    const setProjectDiscipline = (e) => {
        projectInfo.discipline = e.target.value
        updateLocalStorage(projectInfo)
    }

    const setStartDate = (e) => {
        const dateFormat =/^(\d{4})-(\d{2})-(\d{2})$/;
        if (dateFormat.test(e.target.value)) {
            const val = e.target.value.split("-").reverse().join("-");
            projectInfo.start_date = val
        } else {
            projectInfo.start_date = e.target.value
        }
        console.log("!!!!!" + projectInfo.start_date)
        updateLocalStorage(projectInfo)
    }

    const setEndDate = (e) => {
        const dateFormat =/^(\d{4})-(\d{2})-(\d{2})$/;
        if (dateFormat.test(e.target.value)) {
            const val = e.target.value.split("-").reverse().join("-");
            projectInfo.end_date = val
        } else {
            projectInfo.end_date = e.target.value
        }
        console.log("!!!!!" + projectInfo.start_date)

        updateLocalStorage(projectInfo)
    }


    return (
        <div className='container'>
            <div className='form'>
                <form onSubmit = {handleSubmit((data) => {
                    console.log(data)

                })}>


                    <div className='form-row'>
                        <div className='left'>
                            <label>Project Name</label>
                        </div>
                        <div className='right'>
                            <input {...register("ProjectName",{required:'This is required.'}) } placeholder ="Project Name" onChange={setProjectName}/>
                            <p>{errors.ProjectName?.message}</p>
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='left'>
                            <label>Discipline</label>
                        </div>
                        <div className='right'>
                            <input {...register("Discipline",{required:'This is required.'}) } placeholder ="Discipline" onChange={setProjectDiscipline}/>
                            <p>{errors.Discipline?.message}</p>
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='left'>
                            <label>Start Date</label>
                        </div>
                        <div className='right'>
                            <input type='Date' {...register("StartDate","test",{valueAsDate: true}) } onChange={setStartDate} />
                            <p>{errors.StartDate?.message}</p>
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='left'>
                            <label>End Date</label>
                        </div>
                        <div className='right'>
                            <input type='Date' {...register("EndDate","test",{valueAsDate: true})} onChange={setEndDate} />
                            <p>{errors.EndDate?.message}</p>
                        </div>
                    </div>

                    {/* <div className='submit-btn'>
                        <input type="submit" />
                    </div> */}

                </form>
            </div>

        </div>
    )
}

export default ProjectInfForm
