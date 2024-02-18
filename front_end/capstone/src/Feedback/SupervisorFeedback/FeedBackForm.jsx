import React from 'react'
import axios from 'axios'
import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
import './feedBackForm.css'
import { response } from 'msw';
import {get} from "../../AxiosInstance/axiosController"
import { Rating } from '@mui/material';



const FeedBackForm = () => {

    var contents = []

    const [feedBack, setFeedback] = React.useState({content: "", rate: ""})
    const [rate, setRate] = React.useState(0);

    const  {
        register,
        handleSubmit,
        setValue,
        formState:{errors}
    } = useForm({
    defaultValues: {
        Feedback: '',
        Rate:''
    }
    });

    const setFeedBack = (e)=> {
        feedBack.content = e.target.value
        setFeedback(feedBack)
        localStorage.setItem('feedback', JSON.stringify(feedBack))
    }

    return (
        <div className='container'>
            <div className='form' id='personal-info-form'>
                <form onSubmit = {handleSubmit((data) => {
                })}>
                    <div className='form-row'>

                        <div className='left'>
                             <label>Feedback</label>
                        </div>
                        <div className='right'>
                            <input {...register("Name",{required:'This is required.'})} onChange={setFeedBack}/>
                            <p>{errors.feedback?.message}</p>
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='left'>
                            <label>Rate</label>
                        </div>
                        <div className='right'>
                            {/* <input {...register("Location",{required:'This is required.'})} onChange= {setLocation} /> */}
                            <Rating
                                name="simple-controlled"
                                value={rate}
                                onChange={(event, newValue) => {
                                    setRate(newValue);
                                    feedBack.rate = newValue
                                    setFeedback(feedBack)
                                    localStorage.setItem('feedback', JSON.stringify(feedBack))
                                }}
                            />
                            <p>{errors.rate?.message}</p>
                        </div>
                    </div>

                </form>
            </div>

        </div>
    )
}

export default FeedBackForm
