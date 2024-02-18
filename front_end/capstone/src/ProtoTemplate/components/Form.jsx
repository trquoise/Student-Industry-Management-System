import React from 'react'
import { useForm } from "react-hook-form";
import { useState } from 'react';
import './form.css'


const Form = () => {

    const  {
            register,
            handleSubmit,
            formState:{errors}
    } = useForm({
        defaultValues: {
            Name:'',
            location:'',
            Email:''
        }
    });

    return (
        <div className='container'>
            <div className='form'>
                <form onSubmit = {handleSubmit((data) => {
                    console.log(data)

                })}>
                    <div className='form-row'>

                        <div className='left'>
                             <label>Name</label>
                        </div>
                        <div className='right'>
                            <input {...register("Name",{required:'This is required.'})} placeholder ="Name"/>
                            <p>{errors.Name?.message}</p>
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='left'>
                            <label>Location</label>
                        </div>
                        <div className='right'>
                            <input {...register("location",{required:'This is required.'}) } placeholder ="location"/>
                            <p>{errors.location?.message}</p>
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='left'>
                            <label>Phone number</label>
                        </div>
                        <div className='right'>
                            <input {...register("Phonenumber",{required:'This is required.'}) } placeholder ="Phone number"/>
                            <p>{errors.Phonenumber?.message}</p>
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='left'>
                            <label>Degree</label>
                        </div>
                        <div className='right'>
                            <input {...register("Degree",{required:'This is required.'}) } placeholder ="Degree"/>
                            <p>{errors.Degree?.message}</p>
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='left'>
                            <label>Major</label>
                        </div>
                        <div className='right'>
                            <input {...register("Major",{required:'This is required.'}) } placeholder ="Major"/>
                            <p>{errors.Major?.message}</p>
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='left'>
                            <label>Project Name</label>
                        </div>
                        <div className='right'>
                            <input {...register("ProjectName",{required:'This is required.'}) } placeholder ="Project Name"/>
                            <p>{errors.ProjectName?.message}</p>
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='left'>
                            <label>Discipline</label>
                        </div>
                        <div className='right'>
                            <input {...register("Discipline",{required:'This is required.'}) } placeholder ="Discipline"/>
                            <p>{errors.Discipline?.message}</p>
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='left'>
                            <label>Start Date</label>
                        </div>
                        <div className='right'>
                            <input type='Date' {...register("StartDate","test",{valueAsDate: true}) } />
                            <p>{errors.StartDate?.message}</p>
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='left'>
                            <label>End Date</label>
                        </div>
                        <div className='right'>
                            <input type='Date' {...register("EndDate","test",{valueAsDate: true}) } />
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

export default Form
