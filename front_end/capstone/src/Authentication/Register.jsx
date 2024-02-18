import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import unsw_logo from "../images/unsw_logo.png";
import add from "../images/add.png";
import sty from "./Register.module.css";

window.verificationTime = 60;
export default function Com() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verify_code, setVerify_code] = useState("");
  const [role, setRole] = useState("Student");
  const [disabled, setDisabled] = useState(false);
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
            <button
              onClick={() => {
                navigate("/visitorHomepage");
              }}
            >
              Home
            </button>
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
        <h2>Registration</h2>
        <div>
          <div>
            <label htmlFor="my-name">User name:</label>
            <input
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              type="text"
              name="my-name"
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              name="password"
              required
            />
          </div>
          <div>
            <label htmlFor="confirm-password">Confirm Password:</label>
            <input
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              type="password"
              name="confirm-password"
              required
            />
          </div>
          <div className={sty["email-container"]}>
            <label htmlFor="email">Email:</label>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              name="email"
              required
            />
            <button
              id="verify-email-button"
              onClick={() => {
                var verifyEmailButton = document.getElementById(
                  "verify-email-button"
                );
                if (!verifyEmailButton.disabled) {
                  window.verificationTime = 60;
                  if (!email) {
                    alert("Email cannot be empty!");
                    return;
                  }
                  
                  fetch("/api/generateEmailCode", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      email,
                    }),
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      if (data.code === 200) {
                        alert("Verification email sent. Check your inbox.");
                      } else {
                        alert("Failed to send verification email.");
                      }
                    })
                    .catch((error) => {
                      console.error("Error:", error);
                      alert(
                        "An error occurred while sending the verification email."
                      );
                    });
                  verifyEmailButton.disabled = true;
                  window.verificationTimer = setInterval(function () {
                    window.verificationTime--;
                    if (window.verificationTime <= 0) {
                      clearInterval(window.verificationTimer);
                      verifyEmailButton.disabled = false;
                      verifyEmailButton.textContent = "Verify Email (60s)";
                    } else {
                      verifyEmailButton.textContent =
                        "Verify Email (" + window.verificationTime + "s)";
                    }
                  }, 1000);
                }
              }}
              type="button"
            >
              Verify Email (60s)
            </button>
          </div>
          <div>
            <label htmlFor="verification-code">Verification Code:</label>
            <input
              value={verify_code}
              onChange={(e) => {
                setVerify_code(e.target.value);
              }}
              type="text"
              name="verification-code"
              required
            />
          </div>
          <div>
            <label htmlFor="user-type">User Type:</label>
            <select
              value={role}
              onChange={(e) => {
                console.log("value = ", e.target.value);
                // var r = e.target.value
                setRole(e.target.value)
                console.log(e.target.value)
              }}
              name="user-type"
              required
            >
              <option value="student">Student</option>
              <option value="academic-supervisor">Academic Supervisor</option>
              <option value="industry-partner">Industry Partner</option>
            </select>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <input type="checkbox" name="terms" required />
            <label
              style={{
                marginBottom: 0,
              }}
              htmlFor="terms"
            >
              I accept the legal terms
            </label>
          </div>

          <div>
            <input
              onClick={() => {
                var passwordPattern = /^(?=.*[A-Za-z\d\S]).{8,}$/;
                if (!passwordPattern.test(password)) {
                  alert(
                    "Password could contain letters (uppercase or lowercase), digits, special characters, and be at least 8 characters long."
                  );
                  return;
                }
                if (password !== confirmPassword) {
                  alert("Passwords do not match.");
                  return;
                }
                alert("Registering...");
                
                var userData = {
                  username,
                  password,
                  email,
                  role,
                  verify_code,
                };


                if (userData.role == "industry-partner") {
                  userData.role = "3"
                } else if (userData.role == "academic-supervisor") {
                  userData.role = "2"
                } else {
                  userData.role = "1"
                }

                console.log(userData)

               
                fetch("/api/register", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(userData),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    console.log("data = ", data)
                    if (data.code == 201) {
                      alert("Registration successful.");
                      navigate("/personInfo", { state: { role: userData.role, token: data.data.token } });
                    } else {
                      alert("Registration failed. " + data.msg);
                    }
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                    alert("An error occurred while registering.");
                  });
              }}
              type="submit"
              value="Register"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
