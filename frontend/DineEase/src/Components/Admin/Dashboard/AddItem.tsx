import React, { useRef, useState } from "react";
import { PlusCircle, Image as ImageIcon, X } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Input } from "../../common/ui/Input";
import { Button } from "../../common/ui/Button";
import { Card } from "../../common/ui/Card";


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

      const url1= import.meta.env.VITE_API_URL || import.meta.env.VITE_DOCKER_URL || 'https://dine-ease.coderspro.xyz/';
      const response = await fetch(`${url1}api/v1/admin/imageupload`, {
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
      // console.log(url);
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
      const url= import.meta.env.VITE_API_URL || import.meta.env.VITE_DOCKER_URL || 'https://dine-ease.coderspro.xyz/';
      const response = await fetch(`${url}api/v1/admin/additem`, {
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
      // console.log({ title, description, amount });
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
          <Card className="max-w-md w-full mt-10 p-6">
          <h2 className="text-3xl font-serif font-semibold text-center text-brand-maroon mb-6">
            Add Menu Item
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <Input
              label="Title"
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* Description */}
            <div>
              <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-brand-ink">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full rounded-lg border border-brand-cream-dark bg-white px-4 py-2.5 text-sm text-brand-ink shadow-sm outline-none transition focus:border-brand-maroon focus:ring-2 focus:ring-brand-turmeric/40 resize-none placeholder:text-brand-ink-soft/60"
              />
            </div>

            {/* Amount */}
            <Input
              label="Amount"
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
            />

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="mb-1.5 block text-sm font-medium text-brand-ink">
                Image
              </label>
              <div className="mt-1">
                <label
                  htmlFor="image"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-cream border border-brand-cream-dark rounded-lg cursor-pointer hover:bg-brand-cream-dark transition-colors"
                >
                  <ImageIcon className="w-5 h-5 text-brand-terracotta" />
                  <span className="text-sm text-brand-ink">
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
                    <div className="flex items-center justify-between bg-brand-cream rounded-lg p-2">
                      <span className="text-sm text-brand-ink-soft truncate">{image.name}</span>
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
            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={!buttonstate || loading}
            >
              <PlusCircle className="h-5 w-5" />
              <span>{loading ? "Adding..." : "Add Item"}</span>
            </Button>
          </form>
        </Card>
      </div>
    );    }