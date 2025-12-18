import React, { useState } from "react";
import "./LoginPopUp.css";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { GiCrossedBones } from "react-icons/gi";

const LoginPopUp = ({ setShowLogin,setProfile }) => {
  const [currstate, setcurrstate] = useState("login");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [name, setname] = useState("");
  const [surname, setsurname] = useState("");
  const [profilePic, setProfilePic] = useState(assets.user_icon);

  // const navigate = useNavigate();
  
  const handleSubmit =(e) =>{
    e.preventDefault();
    if(currstate === "signup"){
      localStorage.setItem(
        "user",
         JSON.stringify({name:name,email:email,password:password})
      );
      alert("Account created successfully! ");
      setcurrstate("login");
    }else{
      const user = JSON.parse(localStorage.getItem("user"))
      if(user && user.email === email && user.password=== password){
        alert(`Welcome Back, ${user.name}`);
        setShowLogin(false);
      }
    }
  }


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // temporary preview
      setProfilePic(imageUrl);
    }
  };

  // const navigate = useNavigate();
  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>{currstate}</h2>
          <div onClick={()=>setShowLogin(false)}><GiCrossedBones /></div>
        </div>
        <div className="login-popup-inputs">
          {currstate === "login" ? null : (
            <div className="profile-container">
              <label htmlFor="profile-upload">
                <img
                  src={profilePic}
                  alt="profile"
                  className="profile-pic"
                  title="Click to upload profile picture"
                />
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
            </div>
          )}
          {currstate === "login" ? null : (
            <input
              type="text"
              placeholder="Your name"
              required
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Enter your mail"
            required
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            required
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
        </div>
        <button type="submit" >
          {currstate === "signup" ? "Create Account" : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        {currstate === "login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setcurrstate("signup")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setcurrstate("login")}>Login</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopUp;
