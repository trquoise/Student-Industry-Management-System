import React from 'react'
import axios from 'axios'
import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
import './personalInfForm.css'
import { response } from 'msw';



const TagForm = () => {

    const  {
        register,
        handleSubmit,
        formState:{errors}
    } = useForm({
    defaultValues: {
        Tag: ''
    }
    });

    const setTag = (e)=> {
        localStorage.setItem('new_tag', e.target.value)
    }

    return (
        <div className='container'>
            <div className='form' id='personal-info-form'>
                <form onSubmit = {handleSubmit((data) => {
                    console.log(data)
                })}>
                    <div className='form-row'>

                        <div className='left'>
                             <label>New Tag</label>
                        </div>
                        <div className='right'>
                            <input {...register("Tag",{required:'This is required.'})} onChange={setTag}/>
                            <p>{errors.Tag?.message}</p>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default TagForm
