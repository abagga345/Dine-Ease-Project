import React, { useRef, useState } from "react";
import { PlusCircle, Image as ImageIcon, X } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export const AddItem = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setImageUrl] = useState("");
  const [buttonstate, setbuttonstate] = useState(true);

  const navigate=useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setImage(file);
      } else {
        toast.error("Please upload a valid image file.",{id:"invalid-image-toast"});
        e.target.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const uploadImage = async (image: File) => {
    try {
      const formData = new FormData();
      formData.append("file", image);

      let token=localStorage.getItem("token");
      if (token===undefined || token===null){
        toast.error("Unauthorized please signin again",{id:"unauth-error-toast"});
        navigate("/admin/signin");
        return;
      }


      const response = await fetch("http://localhost:3000/api/v1/admin/imageupload", {
        method: "POST",
        body: formData,
        headers:{
            Authorization:token
        }
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      const url = data.url;
      console.log(url);
      setImageUrl(url);
      return url;
    } catch (error) {
      console.error("Error uplaoding image", error);
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setbuttonstate(false);
    setLoading(true);
    const toastId = toast.loading("Adding Item...",{id:"add-item-toast"});
    try {
      if (!image) {
        throw new Error("Please enter an image URL");
      }
      const imageUrl = await uploadImage(image);

      let token=localStorage.getItem("token");
      if (token===undefined || token===null){
        toast.error("Unauthorized please signin again",{id:"unauth-error"});
        navigate("/admin/signin");
        return;
      }

      const response = await fetch("http://localhost:3000/api/v1/admin/additem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:token
        },
        body: JSON.stringify({
          title,
          description,
          amount: parseInt(amount),
          imageUrl,
        }),
       });

      if (!response.ok) {
        throw new Error("Failed to add menu item");
      }
      console.log({ title, description, amount });
      setTitle("");
      setDescription("");
      setAmount("");
      setImageUrl("");
      handleRemoveImage();
      toast.dismiss(toastId);
      toast.success("Menu item added successfully!",{id:"item-success-toast"});
    } catch (error) {
      console.error("Error adding menu item:", error);
      toast.dismiss(toastId);
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
    setbuttonstate(true);
  };
    return (
      <div className="flex justify-center items-start w-full px-4">
          <div className="max-w-md w-full mt-10 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">
            Add Menu Item
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
    
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
    
            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                min="1"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || Number(value) > 0) setAmount(value);
                }}
                onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                required
                className="w-full mt-1 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
    
            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <div className="mt-1">
                <label
                  htmlFor="image"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200"
                >
                  <ImageIcon className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    {image ? "Change Image" : "Upload Image"}
                  </span>
                  <input
                    type="file"
                    id="image"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="sr-only"
                    required
                  />
                </label>
                {image && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between bg-gray-100 rounded p-2">
                      <span className="text-sm text-gray-600 truncate">{image.name}</span>
                      <button type="button" onClick={handleRemoveImage} className="text-red-600 hover:text-red-800">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-full max-h-60 object-contain rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
    
            {/* Submit Button */}
            <button
              type="submit"
              disabled={!buttonstate || loading}
              className={`w-full flex justify-center items-center gap-2 text-white font-medium py-2 px-4 rounded-lg shadow transition-all duration-200 
                ${buttonstate && !loading ? "bg-[#0092FF] hover:bg-[#0073CC]" : "bg-gray-400 cursor-not-allowed"}
              `}
            >
              <PlusCircle className="h-5 w-5" />
              <span>{loading ? "Adding..." : "Add Item"}</span>
            </button>
          </form>
        </div>
      </div>
    );    }