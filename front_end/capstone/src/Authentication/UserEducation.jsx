import React, { useState } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import unsw_logo from "../images/unsw_logo.png";
import add from "../images/add.png";
import sty from "./Register.module.css";


export default function UserEducation() {
  const navigate = useNavigate();
  const location = useLocation();

  const { token } = location.state || {};

  const [major, setMajor] = useState("");
  const [degree, setDegree] = useState("");

  const handleSubmit = () => {
    const educationData = {
      data: [
        {
          degree: degree,
          major: major,
        }
      ]
    };

    fetch('/api/userEducation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(educationData)
    })
    .then((response) => response.json())
    .then(data => {
      if (data.code === 201) {
        console.log('User education info submit', data);
        alert('submit success')
        navigate('/login')
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert(
        "An error occurred while sending the verification email."
      );
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
            <label htmlFor="major">major</label>
            <input value={major} onChange={(e) => setMajor(e.target.value)} type="text" name="major" required />
           </div>
           <div>
            <label htmlFor="degree">degree</label>
            <input value={degree} onChange={(e) => setDegree(e.target.value)} type="text" name="degree" required />
           </div>
        
            
        
          <button onClick={handleSubmit}>Submit</button>
        </div>
    </div>
  )
}
