import React, { useContext, useState } from 'react'
import { assets } from "../assets/assets.js"
import { useNavigate } from "react-router-dom"
import { AppContent } from '../context/appContext.jsx'
import axios from "axios"
// Use axios to send data to backend
import { toast } from 'react-toastify'

const Login = () => {

  const navigate = useNavigate();

  const {backendURL,setIsLoggedIn,getUserData} = useContext(AppContent);

  const [state,setState] = useState("Sign Up");
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      // Prevent loading of page
      axios.defaults.withCredentials = true;
      // send Cookies

      if(state === "Sign Up"){
        const { data } = await axios.post(backendURL + "/api/auth/register",{name,email,password});
        if(data.success){
          setIsLoggedIn(true);
          getUserData();
          navigate('/');
        }else{
          toast.error(data.message);
        }
      }
      else{
        const { data } = await axios.post(backendURL + "/api/auth/login",{email,password})
        if(data.success){
          setIsLoggedIn(true);
          getUserData();
          navigate('/');
        }else{
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  }


  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 '>
      <img onClick={() => { navigate('/') }} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>

      <div className='bg-slate-900 p-10 w-full rounded-lg shadow-lg sm:w-96 text-indigo-300 text-sm'>

        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === "Sign Up" ? "Create Account" : "Login"}</h2>
        <p className='text-sm text-center mb-6'>{state === "Sign Up" ? "Create your account" : "Login to your account"}</p>

        <form onClick={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className='flex align-center mb-4 gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} alt="" />
              <input type="text" placeholder='Full Name' required className='bg-transparent outline-none' onChange={e => setName(e.target.value)} value={name}/>
            </div>
          )}
          <div className='flex align-center mb-4 gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.mail_icon} alt="" />
              <input type="email" placeholder='Email Id' required className='bg-transparent outline-none' onChange={e => setEmail(e.target.value)} value={email}/>
          </div>
          <div className='flex align-center mb-4 gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.lock_icon} alt="" />
              <input type="password" placeholder='Password' required className='bg-transparent outline-none' onChange={e => setPassword(e.target.value)} value={password}/>
          </div>
          <p onClick={() => {navigate('/reset-password')}} className='mb-4 text-indigo-300 cursor-pointer'>Forgot Password ?</p>
          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>{state}</button>

          {state === "Sign Up" ? (
            <p className='text-gray-400 text-sm mt-3 text-center'>Already have an account ? {' '} 
            <span onClick={() => setState("Login")} className='text-blue-400 cursor-pointer underline'> Login here</span>
          </p>
          ) 
          : (
            <p className='text-gray-400 text-sm mt-3 text-center'>Don't have an account ? {' '} 
            <span onClick={() => setState("Sign Up")} className='text-blue-400 cursor-pointer underline'> Sign Up</span>
          </p>
          )}
        </form>

      </div>
    </div>
  )
}

export default Login