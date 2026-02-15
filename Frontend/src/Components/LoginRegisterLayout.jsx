import React, { useState } from 'react'
import Login from './Login';
import Register from './Register';
import '../SignUpLogin.css';

const LoginRegisterLayout = () => {
  const [toggleAnimation, setToggleAnimation] = useState(false);

  return (
    <div className="form-body">
      <div className={`wrapper ${toggleAnimation ? "active" : ""}`}>
        {/* Background animation for login & register */}
        <span className="bg-animation"></span>
        <span className="bg-animation2"></span>

        <Login setToggleAnimation={setToggleAnimation} />
        <Register setToggleAnimation={setToggleAnimation} />
      </div>
    </div>
  )
}

export default LoginRegisterLayout
