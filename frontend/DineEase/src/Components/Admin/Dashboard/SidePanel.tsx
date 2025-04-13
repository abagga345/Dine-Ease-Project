import React, { useEffect, useState } from "react";
import { MdDashboard } from "react-icons/md";
import {
  MdBorderColor,
  MdPendingActions,
  MdAnalytics,
  MdAdd,
  MdOutlineMenuBook,
  MdRateReview,
} from "react-icons/md";
import toast from "react-hot-toast";
import { IoHome } from "react-icons/io5";
import { VscSignOut } from "react-icons/vsc";
import { ImProfile } from "react-icons/im";
import { FaCartArrowDown } from "react-icons/fa";
import Loader from "../../common/Loader";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosSettings } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const navItems = [
  { href: "/", label: "Home", icon: IoHome, role: "All" },
  {
    href: "/dashboard/allorders",
    label: "All Orders",
    icon: MdBorderColor,
    role: "Admin",
  },
  {
    href: "/dashboard/pendingorders",
    label: "Pending Orders",
    icon: MdPendingActions,
    role: "Admin",
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    icon: MdAnalytics,
    role: "Admin",
  },
  { href: "/dashboard/additem", label: "Add Item", icon: MdAdd, role: "Admin" },
  {
    href: "/dashboard/menu",
    label: "Menu",
    icon: MdOutlineMenuBook,
    role: "Admin",
  },
  {
    href: "/dashboard/myOrders",
    label: "My Orders",
    icon: FaCartArrowDown,
    role: "User",
  },
  {
    href: "/dashboard/profile",
    label: "My Profile",
    icon: ImProfile,
    role: "All",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: IoIosSettings,
    role: "All",
  }
];

export const SidePanel = () => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const navigate=useNavigate();
  
  const location=useLocation();
  const handleLogout = async () => {
    const toastId = toast.loading("Loading...");
    try {
      localStorage.setItem("token","");
      navigate("/");
      toast.dismiss(toastId);
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(error.message);
    }
  };
  

  useEffect(() => {
    setLoading(true);
    let id=toast.loading("Loading");
    async function rolefetcher(){
        let token=localStorage.getItem("token");
        if (token===undefined || token===null){
            toast.error("Unauthorized , please signin again");
            navigate("/");
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
            toast.error("Please try again later");
            navigate("/");
        }
        setLoading(false);
        toast.dismiss(id);
    }
    rolefetcher();
}, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerWidth]);

  return (
    <>
      {/* Toggle Button for Small Screens */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 text-white bg-green-500 rounded"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <GiHamburgerMenu /> : <IoCloseOutline />}
      </button>

      <div
        className={` h-full bg-green-200 text-black px-6 py-8 flex flex-col justify-between transition-all duration-300 
        ${isCollapsed ? "hidden lg:flex w-64" : "w-full fixed z-40"}`}
      >
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            <MdDashboard className="inline" /> Dashboard
          </h2>
          <nav>
            {loading ? (
              <Loader />
            ) : (
              navItems.map((item) => {
                const Icon = item.icon;
                return (
                  (item.role === role || item.role === "All") && (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`flex flex-row gap-2 items-center px-4 py-2 mb-2 rounded hover:bg-green-300 ${
                        location.pathname === item.href ? "bg-green-300" : ""
                      }`}
                      onClick={() => {
                        setIsCollapsed(true);
                      }}
                    >
                      <Icon className="mr-2" />
                      {item.label}
                    </Link>
                  )
                );
              })
            )}
          </nav>
        </div>
        <div className="flex flex-row gap-2 items-center px-4 py-2 mb-2 hover:bg-green-300 rounded">
          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: handleLogout,
                btn2Handler: () => setConfirmationModal(null),
              })
            }
          >
            <div className="flex items-center gap-x-2">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
        {confirmationModal && (
          <ConfirmationModal modalData={confirmationModal} />
        )}
      </div>

      {/* Overlay for when the menu is open on smaller screens */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        ></div>
      )}
    </>
  );
};


const ConfirmationModal = ({ modalData }) => {
    const { text1, text2, btn1Text, btn2Text, btn1Handler, btn2Handler } =
      modalData;
  
    return (
      <div className="fixed inset-0 flex flex-col gap-8 items-center justify-center z-50 backdrop-blur-sm">
        <div className="md:w-[25%] p-4 rounded-lg shadow-lg flex flex-col gap-2 bg-green-600">
          <p className="text-xl text-white font-semibold">{text1}</p>
          <p className="text-white text-sm">{text2}</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={btn1Handler}
              className="px-4 py-2 bg-yellow-50 font-inter text-black rounded-md hover:bg-green-100 mr-2 font-semibold"
            >
              {btn1Text}
            </button>
            <button
              onClick={btn2Handler}
              className="px-4 py-2 text-white rounded-md "
            >
              {btn2Text}
            </button>
          </div>
        </div>
      </div>
    );
  };