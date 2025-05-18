import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ImProfile } from "react-icons/im";
import { IoIosSettings } from "react-icons/io";
import { MdAdd, MdAnalytics, MdBorderColor, MdDashboard, MdOutlineMenuBook, MdPendingActions, MdRateReview } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export function DashboardHome(){
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate=useNavigate();

    useEffect(() => {
        setLoading(true);
        let id=toast.loading("Loading",{id:"load-toast"});
        async function rolefetcher(){
            let token=localStorage.getItem("token");
            if (token===undefined || token===null || token===""){
                toast.error("Unauthorized , please signin again",{id:"unauth-error-toast"});
                navigate("/signin");
                toast.dismiss(id);
                return;
            }
            try{
                let result=await axios.get("http://localhost:3000/api/v1/user/verifyrole",{
                    headers:{
                        Authorization:token
                    }
                })
                if (result.data.verified==true && (result.data.role=="User" || result.data.role=="Admin") ){
                    setRole(result.data.role);
                }
                else{
                    throw new Error();
                }
            }catch(err){
                toast.error("Please try again later",{id:"try-later-toast"});
                navigate("/");
            }
            setLoading(false);
            toast.dismiss(id);
        }
        rolefetcher();
    }, []);

    if (loading) {
        return (
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-10 h-10 animate-spin text-[#33A8FF]" />
          </div>
        );
    }
    
    return (
        <div className="bg-white p-8 rounded-lg m-6 lg:w-[55%] mx-auto shadow-lg sm:w-[85%]">
          <div>
            <h1 className="text-3xl font-bold mb-5">
              <MdDashboard className="inline" /> Welcome to the Dashboard
            </h1>
            <hr className="my-4" />
            <h2 className="text-lg mt-4 mb-6">
              Ready to serve up something great? Let&apos;s get started!
            </h2>
            <ul>
              <li className="text-md mb-4">
                <span className="font-semibold">
                  <MdBorderColor className="inline" /> All Orders
                </span>
                <br /> Manage and track all orders at a glance.
              </li>
              {(role!=="User")?<div>
              <hr className="mb-4" />
              <li className="text-md mb-4">
                <span className="font-semibold">
                  <MdPendingActions className="inline" /> Pending Orders
                </span>
                <br /> Keep up with orders waiting to be fulfilled.
              </li>
              <hr className="mb-4" />
              <li className="text-md mb-4">
                <span className="font-semibold">
                  <MdAnalytics className="inline" /> Analytics
                </span>
                <br /> Dive into insights and trends to grow your business.
              </li>
              <hr className="mb-4" />
              <li className="text-md mb-4">
                <span className="font-semibold">
                  <MdAdd className="inline" /> Add Item
                </span>
                <br /> Update your menu with delicious new offerings.
              </li>
              <hr className="mb-4" />
              <li className="text-md mb-4">
                <span className="font-semibold">
                  <MdOutlineMenuBook className="inline" /> Menu
                </span>
                <br /> View and customize your entire menu.
              </li>
              </div>:""}
              <hr className="mb-4" />
              <li className="text-md mb-4">
                <span className="font-semibold">
                  <ImProfile className="inline" /> Profile
                </span>
                <br /> View  Profile
              </li>
              <hr className="mb-4" />
              <li className="text-md mb-4">
                <span className="font-semibold">
                  <IoIosSettings className="inline" /> Settings
                </span>
                <br /> Edit  Profile
              </li>
            </ul>
          </div>
        </div>
      );
}