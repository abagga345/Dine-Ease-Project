import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FastfoodIcon from '@mui/icons-material/Fastfood';
import axios from "axios";
import { CircleCheck, CircleX } from "lucide-react";
import { MuiOtpInput } from "mui-one-time-password-input";
import DineEaseImg from "../../../assets/DineEaseImg.png"

interface SignupresultSuccess {
  token: string,
  message: string
}

interface FormFields {
  firstName: string,
  lastName: string,
  contactNo: string,
  email: string,
  password: string,
  confirmpassword:string
}



export function SignupCard() {
  const [error, setError] = useState("");
  const [verified,setVerified]=useState(false);
  const [Otpphase,setOtpPhase]=useState(false);
  const [loading1,setLoading1]=useState(false);
  const [loading2,setLoading2]=useState(false);
  const [loading3,setLoading3]=useState(false);
  const [value,setValue]=useState("");
  const [Otpmsg,setOtpMsg]=useState("");
  const [timer,setTimer]=useState(0);
  const { register,watch, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormFields>();
  const email=watch("email")
  const navigate = useNavigate();

  useEffect(() => {
    let interval: number | NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  async function sendOtpHandler(){
    console.log("request sent");
    // http://localhost:3000/api/v1/user/generateotp
    let result=await axios.post("http://localhost:3000/api/v1/user/generateotp",{
      email:email
    });
    if (result.status===200){
      setOtpMsg("Otp sent successfully")
    }
    else{
      setOtpMsg("Some Error Occurred , Please retry")
    }
    setLoading2(false);
    setTimer(60);
  }

  async function verifyOtpHandler(){
    try {
    let result=await axios.put("http://localhost:3000/api/v1/user/verifyotp",{
      email:email,
      otp:value
    });
    if (result.status===200){
      setVerified(true);
      setLoading1(false);
    }
    else{
      setLoading1(false);
      setOtpMsg("Invalid OTP")
    }
  }
  catch(error) {
    setOtpMsg("Invalid OTP");
    setLoading1(false);
  }
  }

  const handleChange = (newValue: string) => {
    setValue(newValue)
  }

  async function submithandler(data: FormFields) {

    if (data.password!=data.confirmpassword) {
      setError("Password not same as confirm password");
      return;
    }
    const result = await fetch("http://localhost:3000/api/v1/user/signup", {
      method: "POST",
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        contactNo: data.contactNo,
        email: data.email,
        password: data.password
      }),
      headers: {
        "content-type": "application/json"
      }
    })
    if (result.ok) {
      const data: SignupresultSuccess = await result.json();
      localStorage.setItem("token", data["token"]);
      navigate("/home");
      return;
    }
    const err: { message: string } = await result.json();
    setError(err.message);
  }

  function signinnavigator(event: any) {
    event.preventDefault();
    navigate("/signin");
  }

  

  return (
    <div className="w-full h-4/6 flex justify-center items-center ">
      <div className="p-10 md:p-2 rounded-xl border z-10 bg-white  flex h-full  flex-1 md:flex-none w-full md:10/12 lg:w-9/12 xl:w-8/12 2xl:w-7/12 flex-col justify-center  md:shadow-xl ">
       
       <div className="flex h-full">
       
       
        <div className="w-1/2 h-full hidden md:block">
          <img src={DineEaseImg} alt="Welcome Image" className="w-full h-full"></img>
        </div>
        
        <div className="md:w-1/2 flex flex-col justify-center items-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* <img
            alt="Your Company"
            src="https://dynamic.design.com/asset/logo/dbf56484-b03e-440a-b09e-7160d7cff02c/logo-search-grid-1x?logoTemplateVersion=1&v=637888957314700000&text=Burger+store"
            className="mx-auto h-24 w-24"
          /> */}
          <div className="flex justify-center">
            <h1 className='text-sky-600 font-bold mx-6 text-lg'><FastfoodIcon fontSize="small" />&nbsp;DineEase</h1>
          </div>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign up to create an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

          <form onSubmit={handleSubmit(submithandler)}>
           {(!Otpphase || verified)? <div className="flex justify-between gap-5">
              <div className="w-1/2">
                <label htmlFor="firstname" className="block text-sm font-medium leading-6 text-gray-900">
                  FirstName
                </label>
                <div className="mt-2">
                  <input {...register('firstName'
                  )}
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    autoComplete="firstName"
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="w-1/2">
                <label htmlFor="lastname" className="block text-sm font-medium leading-6 text-gray-900">
                  LastName
                </label>
                <div className="mt-2">
                  <input {...register('lastName')}
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    autoComplete="lastName"
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div> :<div></div>}

            {(!Otpphase || verified)?<div>
              <label htmlFor="contactNo" className="block text-sm font-medium leading-6 text-gray-900">
                ContactNo
              </label>
              <div className="mt-2">
                <input {...register('contactNo', {
                  validate: (value) => {
                    if (value.length != 10) {
                      return "CONTACT NUMBER NOT OF 10 DIGITS"
                    }
                    else {
                      for (let i = 0; i < value.length; i++) {
                        if (value[i] >= '0' && value[i] <= '9') continue;
                        else return "CONTACT NUMBER INCORRECT"
                      }
                      return true;
                    }
                  }
                })}
                  id="contactNo"
                  name="contactNo"
                  type="text"
                  required
                  autoComplete="contactNo"
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>:<div></div>}

            <div className="mt-2 ">
              {(errors.contactNo) ? <div style={{ color: "#e53e3e" }} >{errors.contactNo.message}</div> : ""}
            </div>

            <div>
              <div className="flex justify-between">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email
              </label>
              {(verified)?
              <div className="flex gap-2 text-sm"> 
                <div>
                  Verified 
                </div>
                <CircleCheck />
              </div>
              :<div className="flex gap-2 text-sm"> 
              <div>
                Unverified 
              </div>
              <CircleX />
            </div>}
              </div>
              
              <div className="mt-2">
                <input {...register('email', {
                  minLength: {
                    value: 4,
                    message: "email TOO SHORT"
                  },
                  maxLength: {
                    value: 30,
                    message: "email TOO LARGE"
                  }
                })}
                  id="email"
                  name="email"
                  type="text"
                  disabled={Otpphase || verified}
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            {(Otpphase && !verified)?
            <div>
            <div className='h-12 flex flex-col mt-2'>
                <MuiOtpInput
                  value={value}
                  onChange={handleChange}
                  length={6}
                  autoFocus
                />
            </div>
            <div className="flex w-full justify-center gap-3">
            <div>
              {(loading1) ? <button type="button" className="flex mt-5 gap-1  justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" disabled>
                <svg aria-hidden="true" className="w-4 h-4 mt-1 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>Loading...</button> : <button type="button"
                  onClick={()=>{
                    setLoading1(true)
                    verifyOtpHandler();
                  }}
                  className="flex mt-5  justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                Verify OTP
              </button>}
            </div>
            <div>
              {(loading2) ? <button type="button" className="flex mt-5 gap-1  justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" disabled>
                <svg aria-hidden="true" className="w-4 h-4 mt-1 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>Loading...</button> : timer>0 ? (
        <button
          type="button"
          disabled
          className="flex mt-5 justify-center rounded-md bg-gray-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm"
        >
          Resend in {timer}s
        </button>
      ) : <button type="button"
                  onClick={()=>{
                    setLoading2(true);
                    sendOtpHandler();
                  }}
                  className="flex mt-5  justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                Resend OTP
              </button>}
            </div>
            <div>
               <button type="button"
                  onClick={()=>{
                    setOtpPhase(false);
                    setLoading3(false);
                    setLoading2(false);
                    setLoading1(false);
                  }}
                  className="flex mt-5  justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                Back
              </button>
            </div>
            </div>
            </div>:<div></div>}
            <div className="mt-2 ">
              {(errors.email) ? <div style={{ color: "#e53e3e" }} >{errors.email?.message}</div> : ""}
            </div>
            <div className="mt-2 ">
              {(Otpmsg!="" && !verified && Otpphase) ? <div className=" flex items-center justify-center" style={{ color: "#e53e3e" }} >{Otpmsg}</div> : ""}
            </div>

           {(!Otpphase || verified) ?<div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input {...register('password', {
                  minLength: {
                    value: 5,
                    message: "PASSWORD TOO  SHORT"
                  },
                  maxLength: {
                    value: 30,
                    message: "PASSWORD TOO LARGE"
                  }
                })}
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>:<div></div>}


             {(!Otpphase || verified) ?<div>
              <div className="flex items-center justify-between">
                <label htmlFor="confirmpassword" className="block text-sm font-medium leading-6 text-gray-900">
                  Confirm password
                </label>
              </div>
              <div className="mt-2">
                <input {...register('confirmpassword', {
                  minLength: {
                    value: 5,
                    message: "PASSWORD TOO  SHORT"
                  },
                  maxLength: {
                    value: 30,
                    message: "PASSWORD TOO LARGE"
                  }
                })}
                  id="confirmpassword"
                  name="confirmpassword"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>:<div></div>}


            <div className="mt-2 ">
              {(errors.password) ? <div style={{ color: "#e53e3e" }} >{errors.password?.message}</div> : ""}
            </div>

            <div className="mt-2 flex justify-center items-center">
              {(error != "") ? <div style={{ color: "#e53e3e" }} >{error}</div> : ""}
            </div>
            {(!Otpphase && !verified)?<div>
              {(loading3) ? <button type="button" className="flex mt-8 gap-1 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" disabled>
                <svg aria-hidden="true" className="w-4 h-4 mt-1 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>Loading...</button> : <button type="button"
                  onClick={()=>{
                    setLoading3(true);
                    setOtpPhase(true);
                    sendOtpHandler();
                  }}
                  className="flex mt-8 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                Verify Email
              </button>}
            </div>:<div></div>}
            {(verified)?<div>
              {(isSubmitting) ? <button type="button" className="flex mt-8 gap-1 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" disabled>
                <svg aria-hidden="true" className="w-4 h-4 mt-1 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>Loading...</button> : <button type="submit"

                  className="flex mt-8 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                Sign up
              </button>}
            </div>:<div></div>}
          </form>


          <p className="mt-10 text-center text-sm text-gray-500">
            Have an account?{' '}
            <a href="#" onClick={signinnavigator} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              SignIn
            </a>
          </p>
        </div>
        </div>
        </div>
      </div>
    </div>
  )
}