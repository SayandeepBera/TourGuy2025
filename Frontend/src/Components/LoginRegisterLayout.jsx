import React, { useState } from 'react'
import Login from './Login';
import Register from './Register';
import '../SignUpLogin.css';

const LoginRegisterLayout = () => {
  const [toggleAnimation, setToggleAnimation] = useState(false);

  return (
    <>
      <div className="form-body">
        <div className={`wrapper ${toggleAnimation ? "active" : ""}`}>
          {/* Background animation for login & register */}
          <span className="bg-animation"></span>
          <span className="bg-animation2"></span>

          <Login setToggleAnimation={setToggleAnimation} />
          <Register setToggleAnimation={setToggleAnimation} />
        </div>
      </div>
      <div className="flex justify-evenly items-center text-white mt-5">
        <div className="">
          <h4>User credentials</h4>
          <div>
            <p>Username: Rahul</p>
            <p>Password: Rahul4002</p>
          </div>
        </div>

        <div className="">
          <h4>Tour Guide credentials</h4>
          <div>
            <p>Username: ApprovedGuide1</p>
            <p>Password: Guide1_2025</p>
          </div>

          <div>
            <p>Username: ApprovedGuide2</p>
            <p>Password: Guide2_2025</p>
          </div>

          <div>
            <p>Username: PendingGuide1</p>
            <p>Password: Guide_P2025</p>
          </div>
        </div>

        <div>
          <h4>Admin credentials</h4>
          <div>
            <p>Username: Admin#00@</p>
            <p>Password: Tour#321@</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginRegisterLayout
