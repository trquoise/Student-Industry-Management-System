import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import unsw_logo from "../images/unsw_logo.png";
import add from "../images/add.png";
import sty from "./Register.module.css";

export default function PersonInfoInReg() {
  const navigate = useNavigate();
  const Location = useLocation();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  
  const { role, token } = Location.state || {};


  const handleSubmit = () => {
    
    const data = 
      {
      name:name,
      location:location,
      phone:phoneNum,
      }
    
    
    fetch('/api/personalInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.code === 201) {
        if(role === "3") {
          navigate('/companydetail', { state: { token } });
        } else {
        navigate('/usereducation', { state: { token } });
        }
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
            <label htmlFor="name">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" required />
        </div>
        <div>
            <label htmlFor="location">location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" name="location" required />
        </div>
        <div>
            <label htmlFor="phone-num">phone number</label>
            <input value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} type="text" name="phone-num" required />
        </div>
       
          
        
        <button onClick={handleSubmit}>Go Next</button>
      </div>
    </div>
  )
}
