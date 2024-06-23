import { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

import axios from 'axios'
const LoginPopup = ({ setShowLogin }) => {
  const { url, token, setToken } = useContext(StoreContext)
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const onchangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))

  }

  const onLogin = async (event) => {
    event.preventDefault()
    let newUrl = url;

    if (currState === "Login") {
      newUrl += "/api/user/login"
    }
    else {
      newUrl += "/api/user/register"
    }

    const response = await axios.post(newUrl, data);


    if (response.data.success) {
      setToken(response.data.token)
      localStorage.setItem("token", response.data.token)
      setShowLogin(false)
    }

    else {
      alert(response.data.message)
    }

  }


  return (
    <div className="login-popup ">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? (
            <></>
          ) : (
            <input name="name" onChange={onchangeHandler} value={data.name} type="text"
              placeholder="your name" required />
          )}

          <input name="email" value={data.email} onChange={onchangeHandler} type="email"
            placeholder="your email" required />
          <input name="password" value={data.password} onChange={onchangeHandler} type=" password"
            placeholder="password" required />
        </div>
        <button type="submit">{currState === "Sign Up" ? "create account" : "login"}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>BY continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        {currState === "Login" ? (
          <p onClick={() => setCurrState("Sign Up")}>
            Create a new account ? <span>Click here</span>
          </p>
        ) : (
          <p onClick={() => setCurrState("Login")}>
            Already have an account ? <span>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;





