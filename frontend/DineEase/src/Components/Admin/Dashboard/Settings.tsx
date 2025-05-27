import axios from "axios";
import { Loader2 } from "lucide-react";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface profile {
  firstName: string;
  lastName: string;
  contactNo: string;
  email: string;
  storeId:string;
}

export const Setting = () => {
  const [globaluser, setGlobalUser] = useState<profile>({
    firstName: "",
    lastName: "",
    contactNo: "",
    email: "",
    storeId:""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate=useNavigate()
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
    const url= import.meta.env.VITE_API_URL || import.meta.env.VITE_DOCKER_URL || 'http://localhost:3000/';
    fetch(`${url}api/v1/user/viewprofile`,{
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
        });
      })
      .catch((err) => {
        toast.dismiss(toastId);
        // console.log(err);
        setError(err.message);
        toast.error(`Error: ${err.message}`, { id: toastId });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const { register, handleSubmit } = useForm();

  const handleProfileSubmit = async (data: any) => {
    const id = toast.loading("Saving...",{id:"save-toast"});
    let token=localStorage.getItem("token");
      if (token===null || token===undefined){
        setError("Unauthorized , Please signin again");
        toast.error(`Error: ${"Unauthorized , Please Signin again"}`, { id: id });
        navigate("/admin/signin");
        return;
    }
    // console.log(data);
    try {
      const url= import.meta.env.VITE_API_URL || import.meta.env.VITE_DOCKER_URL || 'http://localhost:3000/';
       await axios.put(
        `${url}api/v1/user/editprofile`,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          contactNo: data.contactNo,
        },{
            headers: {
                Authorization: token
            }
        }
      );
      toast.dismiss(id);
      toast.success("Profile updated successfully!",{id:"profile-update-toast"});
    } catch (error: any) {
      toast.dismiss(id);
      console.error("ERROR MESSAGE - ", error.message);
      toast.error("Error updating profile",{id:"profile-error-toast"});
    }
  };

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
    <div className="flex flex-col p-2 md:p-6 gap-10 w-[90%] mx-auto min-h-screen">
      <h1 className="text-black font-semibold text-2xl font-inter text-center">
        Edit Profile
      </h1>
      <div className="flex flex-col gap-8 w-full">
        <div className="flex flex-row gap-4 justify-between items-center text-black bg-white p-8 rounded-lg shadow-lg">
          <div className="md:flex md:flex-row gap-8 items-center justify-between">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${globaluser.firstName}%20${globaluser.lastName}`}
              alt="xyz"
              className="aspect-square w-20 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <p className="text-lg my-1">
             
                {globaluser.email}
              </p>
              {(globaluser.storeId!=="")?<p className="text-lg my-1">
             
             {globaluser.storeId}
           </p>:""}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleProfileSubmit)}>
          <div className="flex flex-col gap-4 mb-10 justify-between text-black bg-white p-8 rounded-lg shadow-lg">
            <div className="flex flex-row gap-8 items-center justify-between">
              <div>
                <p className="text-lg my-1 font-semibold font-inter">
                  Edit Profile Information
                </p>
              </div>
            </div>

            <hr />

            <div className="flex flex-col md:flex-row items-center justify-between mt-4 md:w-[80%] w-[90%] gap-3">
              <div className="flex md:flex-row flex-col gap-8 md:w-[100%]">
                <label htmlFor="firstName">
                  <p>First Name</p>
                  <input
                    type="text"
                    // name="firstName"
                    id="firstName"
                    placeholder="Enter First Name"
                    defaultValue={globaluser?.firstName}
                    {...register("firstName", { required: false })}
                    className="bg-gray-100 p-3 rounded-md mt-3 focus:outline-none w-[100%] text-black font-medium"
                  />
                </label>
                <label htmlFor="lastname">
                  <p>Last Name</p>
                  <input
                    type="text"
                    // name="LastName"
                    id="lastName"
                    placeholder="Enter Last Name"
                    defaultValue={globaluser?.lastName}
                    {...register("lastName", { required: false })}
                    className="bg-gray-100 p-3 rounded-md mt-3 focus:outline-none w-[100%] text-black font-medium"
                  />
                </label>

               

                <label htmlFor="contact">
                  <p>Contact Number</p>
                  <input
                    type="number"
                    // name="contactNo"
                    id="contactNo"
                    placeholder="Enter Contact Number"
                    defaultValue={globaluser?.contactNo}
                    {...register("contactNo")}
                    className="bg-gray-100 p-3 rounded-md mt-3 focus:outline-none w-[100%] text-black font-medium"
                  />
                </label>
              </div>

              
            </div>
          </div>

          <div className="flex flex-row-reverse gap-4 mt-6">
            {/* To be edited */}
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg p-3 font-semibold w-[100%] shadow-lg"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/dashboard/profile";
              }}
            >
              Cancel
            </button>
            <button
              className="text-white bg-[#0092FF] hover:bg-[#0073CC] rounded-lg font-semibold w-[100%] shadow-lg"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};