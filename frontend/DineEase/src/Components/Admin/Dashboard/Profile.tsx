import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AiFillEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

interface profile {
    firstName: string;
    lastName: string;
    contactNo: string;
    email: string;
    storeId:string;
  }
  
export const Profile = () => {
    const [globaluser, setGlobalUser] = useState<profile>({ firstName: "", lastName: "", contactNo: "", email: "" ,storeId:""});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate=useNavigate();
  
    useEffect(() => {
      setLoading(true);
      const toastId = toast.loading("Loading Profile..",{id:"profile-load-toast"});
      let token=localStorage.getItem("token");
      if (token===null || token===undefined){
        setError("Unauthorized , Please signin again");
        toast.error(`Error: ${"Unauthorized , Please Signin again"}`, { id: toastId });
        navigate("/admin/signin");
        return;
        
      }
      fetch("https://dine-ease-project-backend-bcnq.onrender.com/api/v1/user/viewprofile",{
        headers:{
            Authorization:token
        }
      })
        .then(async (data) => {
          let body = await data.json();
          // console.log(body);
          toast.dismiss(toastId);
          toast.success("Profile loaded successfully!", { id: toastId });
          setGlobalUser({
            firstName: body.firstName,
            lastName: body.lastName,
            contactNo: body.contactNo,
            email: body.email,
            storeId:body.storeId
          })
  
        })
        .catch((err) => {
          toast.dismiss(toastId);
          // console.log(err);
          setError(err.message);
          toast.error(`Error: ${err.message}`, { id: toastId });
        })
        .finally(() => {
          setLoading(false);
        })
  
    }, [])
  
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-10 h-10 animate-spin text-[#33A8FF]" />
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      );
    }
  
    return (
      <div className="flex flex-col p-4 md:p-6 gap-6 md:gap-10 w-full md:w-[80%] mx-auto  items-center">
        <h1 className="text-black font-semibold text-xl md:text-2xl font-inter">
          My Profile
        </h1>
        <div className="flex flex-col gap-6 md:gap-8 w-full">
          <div className="flex flex-col md:flex-row gap-4 md:gap-4 justify-between items-center text-black bg-white p-4 md:p-8 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center justify-between w-full">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${globaluser?.firstName}%20${globaluser?.lastName}`}
                  alt="profile"
                  className="aspect-square w-[78px] rounded-full object-cover"
                />
                <div className="flex flex-col md:items-start items-center text-center md:text-left">
                  <p className="text-lg">
                    {globaluser?.firstName + " "}
                    {globaluser?.lastName ? globaluser?.lastName : ""}
                  </p>
                  <p className="text-[#838894] text-md">{globaluser?.email}</p>
                  {(globaluser.storeId!=="")?<p className="text-[#838894] text-md">{globaluser.storeId}</p>:""}
                </div>
              </div>
             
            </div>
          </div>
  
         
  
          <div className="flex flex-col gap-4 justify-between items-center text-black bg-white p-4 md:p-8 rounded-lg shadow-lg w-full">
            <div className="flex flex-col gap-6 justify-between w-full">
              <div className="flex flex-row w-full justify-between items-center sm:gap-8">
                <p className="text-xl">Profile Details</p>
                <button
                  onClick={() => {
                    navigate("/dashboard/settings");
                  }}
                >
                  <div className="flex flex-row items-center gap-2">
                    <AiFillEdit />
                    Edit
                  </div>
                </button>
              </div>
  
              <hr />
  
              <div className="flex flex-col md:flex-row w-full">
                <div className="flex flex-col gap-4 md:gap-8 w-full">
                  <div>
                    <p>First Name</p>
                    <p className="text-[#838894]">
                      {globaluser?.firstName ? `${globaluser?.firstName}` : "Add First Name"}
                    </p>
                  </div>
  
                  <div>
                    <p>Email</p>
                    <p className="text-[#838894]">{globaluser?.email}</p>
                  </div>
  
  
  
                  
                </div>
  
                <div className="flex flex-col gap-4 md:gap-8 w-full">
                  <div>
                    <p>Last Name</p>
                    <p className="text-[#838894]">
                      {globaluser?.lastName ? `${globaluser?.lastName}` : "Add First Name"}
                    </p>
                  </div>
  
                  <div>
                    <p>Contact</p>
                    <p className="text-[#838894]">
                      {globaluser?.contactNo
                        ? `${globaluser?.contactNo}`
                        : "Add Contact"}
                    </p>
                  </div>
  
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };