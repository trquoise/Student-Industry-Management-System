import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import unsw_logo from "../images/unsw_logo.png";
import add from "../images/add.png";
import sty from "./VisitorHomepage.module.css";

export default function Com() {
  const navigate = useNavigate();

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
                navigate("/login");
              }}
              className={sty.login}
            >
              Login
            </button>
            <button
              onClick={() => {
                navigate("/register");
              }}
              className={sty.register}
            >
              Register
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
        <h1>DO YOU WANT TO HAVE SOME JOB OPPOTUNITIES?</h1>
        <h1>OR</h1>
        <h1>DO YOU WANT TO RECRUIT SOME GOOD EMPLOYEES? </h1>
        <h1>Just join us!</h1>
      </div>
    </div>
  );
}
