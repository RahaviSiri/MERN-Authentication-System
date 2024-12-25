import React, { useState,useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { AppContent } from '../context/appContext';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  axios.defaults.withCredentials = true;
  const { backendURL, isLoggedIn, userData, getUserData } = useContext(AppContent);
  const navigate = useNavigate();
  const [email,setEmail] = useState('');
  const [newPassword,setPassword] = useState('');
  const [IsEmailSent,setEmailSent] = useState(false);
  const [otp,setOTP] = useState(0);
  const [IsOtpSubmitted,setIsOtpSubmitted] = useState(false);

  const inputRefs = React.useRef([]);
  
  // To move cursor next box automatically when we enter text
  const inputHandler = (e,index) => {
    if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
      inputRefs.current[index+1].focus();
    }
  }
  // To move cursor previous box automatically when we delete text
  const handleKeyDown = (e,index) => {
    if(e.key === "Backspace" && e.target.value === '' && index > 0){
      inputRefs.current[ index-1 ].focus();
    }
  }

  // If they paste OTP fully.
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char,index) => {
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char;
      }
    })
  }

  const onSubmitEmail = async(e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendURL + "/api/auth/sendResetOTP", {email});
      if(data.success){
        toast.success(data.message);
        setEmailSent(true);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleOTPSubmit = async(e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value);
      setOTP(otpArray.join(''));
      setIsOtpSubmitted(true);
    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleNewPasswordSubmit = async(e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(backendURL + "/api/auth/resetPassword",{email,otp,newPassword});
      if(data.success){
        toast.success(data.message);
        navigate('/login');
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }


  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 '>
      <img onClick={() => { navigate('/') }} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
      {/* Email Input form */}
      {!IsEmailSent && 
      <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter your valid Email address </p>
        <div className='flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
          <img src={assets.mail_icon} alt="" className='w-3 h-3'/>
          <input type="email" className='bg-transparent outline-none text-white' placeholder='Enter Email'value={email} onChange={(e) => setEmail(e.target.value)} required/>
        </div>
        <button className='w-full py-2.5 text-white rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900'>Submit</button>
      </form>}
      

      {/* OTP Input form */}
      {!IsOtpSubmitted && IsEmailSent && 
      <form onSubmit={handleOTPSubmit} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter 6 digit code sent to your email id</p>
        <div className='flex justify-between mb-8' onPaste={handlePaste}>
          {Array(6).fill(0).map((_,index) => (
            <input type="text" maxLength="1" key={index} required className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md' 
            ref={e => inputRefs.current[index] = e}
            onInput={(e) => inputHandler(e,index)}
            onKeyDown={(e) => handleKeyDown(e,index)}/>
          ))}
        </div>
        <button className='w-full py-2.5 text-white rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900'>Submit</button>
      </form>}
      


      {/* New Password form */}
      {IsOtpSubmitted && IsEmailSent && 
      <form onSubmit={handleNewPasswordSubmit} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter New Password </p>
        <div className='flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
          <img src={assets.lock_icon} alt="" className='w-3 h-3'/>
          <input type="password" className='bg-transparent outline-none text-white' placeholder='Enter Password'value={newPassword} onChange={(e) => setPassword(e.target.value)} required/>
        </div>
        <button className='w-full py-2.5 text-white rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900'>Submit</button>
      </form>}
      
    </div>
  )
}

export default ResetPassword