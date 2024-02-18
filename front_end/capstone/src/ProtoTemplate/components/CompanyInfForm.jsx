import React from 'react';
import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
import './form.css';
import { response } from 'msw';
import axios from 'axios';
import { get } from '../../AxiosInstance/axiosController';



const CompanyInfForm = () => {
    var contents = []


    const [companyInfForm, setCompanyInfForm] = React.useState(null)

    const  {
            register,
            handleSubmit,
            setValue,
            formState:{errors}
    } = useForm({
        defaultValues: {
            Name:'',
            Area:'',
        }
    });
    React.useEffect(() => {
        get('/api/company').then((response) => {
            if (response.status === 200) {
                if (response.data.code != 200) {
                    setCompanyInfForm({company_name: '', company_area:''})
                } else {
                    setCompanyInfForm(response.data.data)
                }
            } else {
                console.log('wrong')
            }
        })
    }, []);

    if (companyInfForm != null) {
        setValue("Name", companyInfForm.company_name);
        setValue("Area", companyInfForm.company_area);
    }

    const setName = (e)=> {
        companyInfForm.company_name = e.target.value
        setCompanyInfForm(companyInfForm)
        localStorage.setItem('companyInfo', JSON.stringify(companyInfForm))
    }

    const setArea = (e)=> {
        companyInfForm.company_area = e.target.value
        setCompanyInfForm(companyInfForm)
        localStorage.setItem('companyInfo', JSON.stringify(companyInfForm))
    }





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
                            <input {...register("Name",{required:'This is required.'}) } placeholder ="Name" onChange={setName}/>
                            <p>{errors.Name?.message}</p>
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='left'>
                            <label>Area</label>
                        </div>
                        <div className='right'>
                            <input {...register("Area",{required:'This is required.'}) } placeholder ="Area" onChange={setArea}/>
                            <p>{errors.Area?.message}</p>
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

export default CompanyInfForm
