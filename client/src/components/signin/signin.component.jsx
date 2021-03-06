import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";

import Button from "../button/button.component";
import FormInput from "../formInput/formInput.component";
import AlertBar from "../alertBar/alertBar.component";

import { emailSigninStart } from "../../redux/user/user.actions";

import "./signin.styles.scss";

const Signin = ({ emailSigninStart, currentUser }) => {
  const [userSigninInfo, setUserSigninInfo] = useState({
    username: "",
    password: "",
  });

  const history = useHistory();

  const { username, password } = userSigninInfo;

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("🦄 submitted", userSigninInfo);

    emailSigninStart(userSigninInfo);
    setUserSigninInfo({ username: "", password: "" });

    //* if suceeded in login, redirect to homepage
    if (currentUser) history.push("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserSigninInfo({
      ...userSigninInfo,
      [name]: value,
    });
    // console.log(userSigninInfo);
  };

  // throw new Error("this is emily's error");

  return (
    <div className="form__container">
      <AlertBar />
      <h2 className="form__title">Sign in</h2>
      <span className="form__sub">Sign in with your email and password.</span>
      <form id="form--signin" className="form--signin" onSubmit={handleSubmit}>
        <FormInput
          id="username"
          name="username"
          label="username"
          type="text"
          className="form-input"
          value={username}
          maxLength="15"
          placeholder=" "
          required
          // autoFocus
          onChange={handleChange}
        />

        <FormInput
          id="password"
          name="password"
          label="password"
          value={password}
          type="password"
          className="form-input"
          placeholder=" "
          required
          onChange={handleChange}
        />

        <Button
          className="form__btn"
          form="form--signin"
          content={[
            {
              text: "Sign in",
              type: "submit",
              // linkTo: "/",
            },
          ]}
          style={{
            "--bg-color": "rgb(12, 12, 12)",
            "--font-color-hover": "black",
          }}
        />
        <div className="form--signin__testUser">
          <p>Test User</p>
          <ul>
            <li>Username: emily</li>
            <li>Password: 4321</li>
          </ul>
        </div>
        <h3 className="form__redirect">
          <Link to="/users/signup">
            <span>Sign up</span>
          </Link>
          {" | "}
          <Link to="/users/forgotpassword">
            <span>Forgot Password</span>
          </Link>
        </h3>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.users.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  emailSigninStart: (usernameAndPassword) =>
    dispatch(emailSigninStart(usernameAndPassword)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
