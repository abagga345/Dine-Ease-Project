import React, { useState, useEffect } from "react";
import { Loader2, Trash2 } from "lucide-react";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  id: number;
  title: string;
  description: string;
  amount: number;
  imageUrl: string;
  visibility: boolean;
  loading?:boolean;
}

export const MenuItems: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate=useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        
        let token=localStorage.getItem("token");
      if (token===undefined || token===null){
        setError("Unauthorized please signin again");
        navigate("/admin/signin");
        return;
      }
      const url= import.meta.env.VITE_API_URL || import.meta.env.VITE_DOCKER_URL || 'http://ec2-15-207-248-253.ap-south-1.compute.amazonaws.com:3000/';
        const response = await fetch(`${url}api/v1/admin/allitems`,{
            headers:{
                Authorization:token
            }
        });



        if (!response.ok) {
          throw new Error("Failed to fetch menu items");
        }
        const data = await response.json();
        setMenuItems(
          data.items.map((item: MenuItem) => ({ ...item, loading: false }))
        );
        setLoading(false);
      } catch (err) {
        setError("An error occurred while fetching menu items");
        setLoading(false);
        navigate("/error");
        return;
      }
    };
    fetchMenuItems();
  }, []);

  const toggleOutOfStock = async (index: number) => {
    setMenuItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index].loading = true;
      return updatedItems;
    });

    const toastId = toast.loading("Changing Status...",{id:"change-status-toast"});
    try {
      const item = menuItems[index];
      
      let token=localStorage.getItem("token");
      if (token===undefined || token===null){
        toast.error("Unauthorized please signin again",{id:"unauth-error-toast"});
        navigate("/admin/signin");
        return;
      }
      const url= import.meta.env.VITE_API_URL || import.meta.env.VITE_DOCKER_URL || 'http://ec2-15-207-248-253.ap-south-1.compute.amazonaws.com:3000/';
      
      const response = await fetch(`${url}api/v1/admin/changevisibility`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:token
        },
        body: JSON.stringify({
          id: item.id,
          visibility: !item.visibility,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to change visibility");
      }

      setMenuItems((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[index] = {
          ...updatedItems[index],
          visibility: !prevItems[index].visibility,
          loading: false,
        };
        return updatedItems;
      });
      toast.dismiss(toastId);
      toast.success("Status changed successfully!", { id: toastId });
    } catch (error) {
      console.error("Failed to update visibility:", error);
      toast.dismiss(toastId);
      toast.error("Failed to change status", { id: toastId });
      setMenuItems((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[index].loading = false;
        return updatedItems;
      });
    }
  };

  const deleteMenuItem = async (id: number, imageUrl: string) => {
    const toastId = toast.loading("Deleting item...",{id:"delete-item-toast"});
    try {
        let token=localStorage.getItem("token");
        if (token===undefined || token===null){
          toast.error("Unauthorized please signin again",{id:"unauth-error-toast"});
          navigate("/admin/signin");
          return;
        }
      
        const url1= import.meta.env.VITE_API_URL || import.meta.env.VITE_DOCKER_URL || 'http://ec2-15-207-248-253.ap-south-1.compute.amazonaws.com:3000/';
    const deleteItemResponse = await fetch(`${url1}api/v1/admin/deleteitem?id=${id}`, {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
      if (!deleteItemResponse.ok) {
        throw new Error("Failed to delete item");
      }
      const url2= import.meta.env.VITE_API_URL || import.meta.env.VITE_DOCKER_URL || 'http://ec2-15-207-248-253.ap-south-1.compute.amazonaws.com:3000/';
      const deleteImageResponse = await fetch(`${url2}api/v1/admin/deleteimage`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ file: imageUrl }),
      });
      

      if (!deleteImageResponse.ok) {
        // console.log(deleteImageResponse)
        console.warn("Failed to delete image from Cloudinary");
      }
      setMenuItems((prevItems) => prevItems.filter((item) => item.id !== id));
      toast.dismiss(toastId);
      toast.success("Item deleted successfully!", { id: toastId });
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast.dismiss(toastId);
      toast.error("Failed to delete item", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-[#33A8FF]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Menu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-md overflow-hidden flex flex-col ${
              !item.visibility ? "opacity-50" : ""
            }`}
          >
            {/* Image Section */}
            {item.imageUrl !== "www.whiterosepearora.com" &&
             item.imageUrl !== "www.aroranerd.com" &&
             item.imageUrl !== "www.triptiarora.com" && (
               <img
                 src={item.imageUrl}
                 alt={item.title}
                 width={400}
                 height={200}
                 className="w-full h-48 object-cover"
               />
            )}
  
            {/* Content + Buttons */}
            <div className="p-5 flex flex-col flex-1 justify-between">
              {/* Text Content */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <span className="text-lg font-bold">
                    ₹{item.amount.toFixed(2)}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{item.description}</p>
              </div>
  
              {/* Buttons at the Bottom */}
              <div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={item.loading}
                    onClick={() => toggleOutOfStock(index)}
                    className={`flex-grow font-semibold text-white py-2 px-4 rounded ${
                      item.loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : item.visibility
                        ? "bg-[#0092FF] hover:bg-[#0073CC]"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {item.visibility ? "Mark Out of Stock" : "Mark In Stock"}
                  </button>
                  <button
                    onClick={() => deleteMenuItem(item.id, item.imageUrl)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex-shrink-0"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                {!item.visibility && (
                  <p className="text-red-500 font-bold text-center mt-3">
                    Out of Stock
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  
}  