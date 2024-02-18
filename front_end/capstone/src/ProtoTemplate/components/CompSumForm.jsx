import React from 'react'
import { useForm } from "react-hook-form";
import { useState } from 'react';
import './form.css'


const CompSumForm = () => {

    const  {
            register,
            handleSubmit,
            formState:{errors}
    } = useForm({
        defaultValues: {
            CompanySummary:''
        }
    });

    var summarydata = {company_summary : ""}


    const setSummary = (e) => {
        summarydata.company_summary = e.target.value
        localStorage.setItem("companySum", JSON.stringify(summarydata))
    }

    return (
        <div className='container'>
            <div className='form'>
                <form onSubmit = {handleSubmit((data) => {
                    console.log(data)

                })}>
                    <div className='form-row'>

                        <div className='left'>
                             <label>Company Summary</label>
                        </div>
                        <div className='right'>
                            <textarea {...register("CompanySummary",{required:'This is required.'})} placeholder ="Company Summary" onChange={setSummary}/>
                            <p>{errors.CompanySummary?.message}</p>
                        </div>
                    </div>

                </form>
            </div>

        </div>
    )
}

export default CompSumForm
