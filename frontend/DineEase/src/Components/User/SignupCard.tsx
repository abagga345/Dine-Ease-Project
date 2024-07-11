import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SignupresultSuccess{
    token:string,
    message:string
}

export function SignupCard(){
    const [error,setError]=useState("");
    const [firstName,setFirstName]=useState("");
    const [lastName,setLastName]=useState("");
    const [contactNo,setContactNo]=useState("");
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate();

    async function submithandler(){
        setLoading(true);
        let result=await fetch("http://localhost:3000/api/v1/user/signup",{
            method:"POST",
            body:JSON.stringify({
                firstName:firstName,
                lastName:lastName,
                contactNo:contactNo,
                username:username,
                password:password
            }),
            headers:{
                "content-type":"application/json"
            }
        })
        if (result.ok){
            const data:SignupresultSuccess=await result.json();
            localStorage.setItem("token",data["token"]);
            navigate("/UserHome");
            return;
        }
        //display error message by updating error state
        const err:{message:string}=await result.json();
        setLoading(false);
        setError(err.message);
    }

    function signinnavigator(event:any){
        event.preventDefault();
        navigate("/signin");
    }


    return (
        <div className="w-full h-full flex justify-center items-center">
        <div className="mt-10 z-10 bg-white  flex h-full  flex-1 md:flex-none lg:w-5/12 flex-col justify-center px-6 py-12 lg:px-8 md:shadow-xl ">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <img
                alt="Your Company"
                src="https://dynamic.design.com/asset/logo/dbf56484-b03e-440a-b09e-7160d7cff02c/logo-search-grid-1x?logoTemplateVersion=1&v=637888957314700000&text=Burger+store"
                className="mx-auto h-24 w-24"
              />
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign up to create an account
              </h2>
            </div>
    
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              
              
              <div className="flex justify-between gap-5">
                <div className="w-1/2">
                    <label htmlFor="firstname" className="block text-sm font-medium leading-6 text-gray-900">
                     FirstName
                    </label>
                    <div className="mt-2">
                        <input onChange={(event)=>{
                            setFirstName(event.target.value);
                        }}
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
                    <input onChange={(event)=>{
                            setLastName(event.target.value);
                        }}
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      autoComplete="lastName"
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
            </div>
              
              <div>
                  <label htmlFor="contactno" className="block text-sm font-medium leading-6 text-gray-900">
                   ContactNo
                  </label>
                  <div className="mt-2">
                    <input onChange={(event)=>{
                            setContactNo(event.target.value);
                        }}
                      id="contactno"
                      name="contactno"
                      type="number"
                      required
                      autoComplete="contactno"
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
    
                <div>
                  <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                    Username
                  </label>
                  <div className="mt-2">
                    <input onChange={(event)=>{
                            setUsername(event.target.value);
                        }}
                      id="username"
                      name="username"
                      type="text"
                      required
                      autoComplete="username"
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
    
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                      Password
                    </label>
                    {/* <div className="text-sm">
                      <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Forgot password?
                      </a>
                    </div> */}
                  </div>
                  <div className="mt-2">
                    <input onChange={(event)=>{
                            setPassword(event.target.value);
                        }}
                      id="password"
                      name="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="mt-2 ">
                    {(error!="")?<div style={{color:"#e53e3e"}} >{error}</div>:""}
                </div>
    
                <div>
                    {(loading)?<button type="button" className="flex mt-8 gap-1 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" disabled>
                        <svg aria-hidden="true" className="w-4 h-4 mt-1 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>Loading...</button>:<button onClick={submithandler}
                    
                    className="flex mt-8 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign up
                  </button>}

                  
                  
                
                
                </div>
              
    
              <p className="mt-10 text-center text-sm text-gray-500">
                Have an account?{' '}
                <a href="#" onClick={signinnavigator} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                  SignIn
                </a>
              </p>
            </div>
          </div>
        </div>
      )
}