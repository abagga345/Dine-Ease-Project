import { useEffect, useState } from "react";
import { MdDashboard } from "react-icons/md";
import {
  MdBorderColor,
  MdPendingActions,
  MdAnalytics,
  MdAdd,
  MdOutlineMenuBook,
} from "react-icons/md";
import toast from "react-hot-toast";
import { IoHome } from "react-icons/io5";
import { VscSignOut } from "react-icons/vsc";
import { ImProfile } from "react-icons/im";
import { FaAddressCard, FaCartArrowDown } from "react-icons/fa";
import Loader from "../../common/Loader";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosSettings } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ConfirmModal } from "../../common/ui/Modal";


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
    label: "Products",
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
    href:"/dashboard/addresses",
    label:"My Address",
    icon: FaAddressCard,
    role:"User"
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
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const navigate=useNavigate();
  
  const location=useLocation();
  const handleLogout = async () => {
    const toastId = toast.loading("Loading...",{id:"load-toast"});
    try {
      localStorage.setItem("token","");
      localStorage.setItem("cart","{}");
      localStorage.setItem("storeId","");
      navigate("/");
      toast.dismiss(toastId);
      toast.success("Logged out successfully",{id:"logout-toast"});
      
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(error.message);
    }
  };
  

  useEffect(() => {
    setLoading(true);
    let id=toast.loading("Loading",{id:"load-toast"});
    async function rolefetcher(){
        let token=localStorage.getItem("token");
        if (token===undefined || token===null || token===""){
            toast.error("Unauthorized , please signin again",{id:"unauth-error-toast"});
            toast.dismiss(id);
            navigate("/signin");
            return;
        }
        try{
          const url= import.meta.env.VITE_API_URL || import.meta.env.VITE_DOCKER_URL || 'https://dine-ease.coderspro.xyz/';
            let result=await axios.get(`${url}api/v1/user/verifyrole`,{
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
            navigate("/error");
            return;
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 text-brand-cream bg-brand-maroon rounded-lg shadow-soft"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <GiHamburgerMenu /> : <IoCloseOutline />}
      </button>


      <div
        className={` min-h-screen bg-brand-maroon text-brand-cream px-6 py-8 flex flex-col justify-between transition-all duration-300
        ${isCollapsed ? "hidden lg:flex min-w-64" : "w-full fixed z-40"}`}
      >
        <div>
          <h2 className="text-2xl font-serif font-semibold mb-6 text-brand-cream flex items-center gap-2">
            <MdDashboard className="inline" /> Dashboard
          </h2>
          <nav>
            {loading ? (
              <Loader />
            ) : (
              navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  (item.role === role || item.role === "All") && (
                    <Link
                      key={item.href}
                      to={item.href}
                     className={`flex flex-row gap-2 items-center px-4 py-2 mb-2 rounded-lg border-l-4 transition-colors
                     hover:bg-brand-maroon-dark ${isActive ? "bg-brand-maroon-dark border-brand-turmeric text-white" : "border-transparent text-brand-cream/90"}`}

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
        <div className="sticky bottom-0 bg-brand-maroon py-4">
           <div className="flex flex-row gap-2 items-center px-4 py-2 rounded-lg hover:bg-brand-maroon-dark transition-colors">

          <button
            onClick={() => setLogoutModalOpen(true)}
          >
            <div className="flex items-center gap-x-2 text-brand-cream">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
        </div>
      </div>

      <ConfirmModal
        open={logoutModalOpen}
        title="Are you sure?"
        message="You will be logged out of your account."
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={() => {
          setLogoutModalOpen(false);
          handleLogout();
        }}
        onCancel={() => setLogoutModalOpen(false)}
      />

      {/* Overlay for when the menu is open on smaller screens */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-brand-ink opacity-50 z-30 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        ></div>
      )}
    </>
  );
};