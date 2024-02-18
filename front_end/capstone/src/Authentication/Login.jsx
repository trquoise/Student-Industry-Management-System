import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import unsw_logo from "../images/unsw_logo.png";
import add from "../images/add.png";
import sty from "./Login.module.css";

export default function Com() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        <h2>Login</h2>
        <div id="login-form">
          <div>
            <label htmlFor="login-email">Email:</label>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              name="login-email"
              required
            />
          </div>
          <div>
            <label htmlFor="login-password">Password:</label>
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              name="login-password"
              required
            />
          </div>
          <div>
            <input
              type="submit"
              onClick={() => {
                if (!email) {
                  alert("Email cannot be empty!");
                  return;
                }
                if (!password) {
                  alert("Password cannot be empty!");
                  return;
                }
               
                fetch("/api/login", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    email,
                    password,
                  }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                
                    if (data.code === 200) {
                      alert("Login successful.");
                      window.sessionStorage.hasLogin = "Y";
                      console.log(data)
                      localStorage.setItem("token", data.data.token)
                      localStorage.setItem("role", data.data.role)
                      localStorage.setItem('username', data.data.username)
                      localStorage.setItem('email', email)
                      localStorage.setItem('currentUserId', data.data.user_id)
                      navigate('/')
                    } else if (data.code === 401) {
                      alert("Login failed. " + data.msg);
                    } else {
                      alert("An error occurred while logging in.");
                    }
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                    alert("An error occurred while logging in.");
                  });
              }}
              value="Login"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
