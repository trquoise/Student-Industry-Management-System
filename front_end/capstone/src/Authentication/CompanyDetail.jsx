import React, { useState } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import unsw_logo from "../images/unsw_logo.png";
import add from "../images/add.png";
import sty from "./Register.module.css";


export default function CompanyDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const { token } = location.state || {};
  
  const [company, setCompany] = useState("");
  const [area, setArea] = useState("");

  const handleSubmit = () => {

    const companyData = {
      
        
          company_name: company,
          company_area: area,
        
        
      
      
    };

    fetch('/api/company', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(companyData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.code === 200) {
        console.log('Company posted', data);
        alert('submit success')
        navigate('/login')
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };


  return (
        <div>
          <div className={sty["top-container"]}>
            <div className={sty.menu}>
              <div className={sty["unsw-logo"]}>
                <img
                  src={unsw_logo}
                  alt="unsw-logo"
                  style={{
                    width: 100,
                    height: 40,
                  }}
                />
              </div>
              <div className={sty["website-name"]}>
                <h2>Student Industry Project Management System</h2>
              </div>
              <div className={sty["btn-home"]}>
                <button onClick={() => {
                    navigate('/visitorHomepage');
                }}>Home</button>
              </div>
            </div>
            <div
              className={sty["background-picture"]}
              style={{
                backgroundImage: `url(${add})`,
              }}
            ></div>
          </div>
          <div className={sty["bottom-container"]}> 
        
           <div>
            <label htmlFor="company">company</label>
            <input value={company} onChange={(e) => setCompany(e.target.value)} type="text" name="company" required />
           </div>
           <div>
            <label htmlFor="company-area">company-area</label>
            <input value={area} onChange={(e) => setArea(e.target.value)} type="text" name="company-area" required />
           </div>
       
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  )
}
