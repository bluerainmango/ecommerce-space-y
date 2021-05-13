import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import Button from "../button/button.component";
import FormInput from "../formInput/formInput.component";

import { emailSigninStart } from "../../redux/user/user.actions";
import "./signin.styles.scss";

const Signin = ({ emailSigninStart }) => {
  const [userSigninInfo, setUserSigninInfo] = useState({
    username: "",
    password: "",
  });

  const { username, password } = userSigninInfo;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted", userSigninInfo);

    emailSigninStart(userSigninInfo);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserSigninInfo({
      ...userSigninInfo,
      [name]: value,
    });
    console.log(userSigninInfo);
  };

  return (
    <div className="form__container">
      <h2 className="form__title">Sign in</h2>
      <span className="form__sub">Sign in with your email and password.</span>
      <form className="form--signin" onSubmit={handleSubmit}>
        <FormInput
          id="username"
          name="username"
          label="username"
          type="text"
          className="form-input"
          value={username}
          maxLength="10"
          title="Please input less than 10 characters"
          // required
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
          // required
          onChange={handleChange}
        />

        <Button
          className="form__btn"
          type="submit"
          text={["SIGN IN"]}
          style={{
            "--bg-color": "rgb(12, 12, 12)",
            "--font-color-hover": "black",
          }}
        />
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

const mapDispatchToProps = (dispatch) => ({
  emailSigninStart: (usernameAndPassword) =>
    dispatch(emailSigninStart(usernameAndPassword)),
});

export default connect(null, mapDispatchToProps)(Signin);
