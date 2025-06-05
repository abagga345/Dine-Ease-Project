import { FaShoppingCart } from "react-icons/fa";
import { Review } from "./Review";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import AppAppBar from "../Home/AppAppBar";
import Footer from "../Home/Footer";

interface MenuItem1 {
    id: number;
    title: string;
    description: string;
    amount: number;
    imageUrl: string;
    visibility: boolean;
    storeId:string;
  }

interface MenuItemProps{
    item:MenuItem1
}

type Cart = {
    [key: number]: number;
  };


export function MenuItem(){
    return (
        <>
            <AppAppBar></AppAppBar>  
            <Item></Item>
            <Review></Review>
            <Footer></Footer>
        </>
    )
}

  




function Item(){
    const [cart, setCart] = useState<Cart>({});
    const [loading,setLoading]=useState(true);
    const [item,setItem]=useState<MenuItem1>({
        id:0,
        imageUrl:"",
        description:"",
        visibility:false,
        storeId:"",
        amount:0,
        title:""
    })
    const navigate=useNavigate();
    const {itemId}=useParams()
   
    useEffect(() => {
        
        const fetchMenuItems = async () => {
            try {
                const store = localStorage.getItem("storeId");
                if (store===null || store===undefined || store==="") {
                    navigate("/store");
                    return;
                }
                //check whether that store has that menu item id !!!!
                // if not navigate user
                // not adding currently , let checkout itself validate and send error if user adds multi store items
                const url= import.meta.env.VITE_API_URL || import.meta.env.VITE_DOCKER_URL || 'https://ec2-15-207-248-253.ap-south-1.compute.amazonaws.com:3000/';
                const res = await fetch(`${url}api/v1/user/viewmenuitem?itemId=${itemId}`);
                const data = await res.json();
                setItem({
                    id:data.id,
                    imageUrl:data.imageUrl,
                    description:data.description,
                    visibility:data.visibility,
                    amount:data.amount,
                    storeId:data.storeId,
                    title:data.title,
                });
              } catch (error) {
                console.error("Failed to fetch item", error);
                toast.error("Failed to fetch menu item")
                navigate("/error");
                return;
              } finally {
                setLoading(false);
              }
            };
        
            fetchMenuItems();
            loadCartFromLocalStorage();
        }, []);

    
    
    
    const saveCartToLocalStorage = (cartItems: Cart) => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
      };
    
    const loadCartFromLocalStorage = () => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
    };
    
    const updateCart = (itemId: number, quantityChange: number) => {
        setCart((prevCart) => {
          const newCart = { ...prevCart };
          const currentQuantity = prevCart[itemId] || 0;
          const newQuantity = Math.max(0, currentQuantity + quantityChange);
    
          if (newQuantity === 0) {
            delete newCart[itemId];
          } else {
            newCart[itemId] = newQuantity;
          }
    
          saveCartToLocalStorage(newCart);
          return newCart;
        });
      };
    
      const incrementQuantity = (itemId: number) => {
        updateCart(itemId, 1);
      };
    
      const decrementQuantity = (itemId: number) => {
        updateCart(itemId, -1);
      };
    
      const addToCart = (itemId: number) => {
        updateCart(itemId, 1);
      };
    
      const getItemQuantity = (itemId: number): number => {
        return cart[itemId] || 0;
      };
      
      const RenderCartControls = ({item}:MenuItemProps) => {
        const quantity = getItemQuantity(item.id);
    
        if (quantity > 0) {
          return (
            <>
              <button
                onClick={() => decrementQuantity(item.id)}
                className="px-4 py-2 bg-gray-400 text-white rounded-md"
              >
                -
              </button>
              <span className="text-lg mx-2 w-6 text-center">{quantity}</span>
              <button
                onClick={() => incrementQuantity(item.id)}
                className="px-4 py-2 bg-[#0092FF] hover:bg-[#0073CC] text-white rounded-md"
              >
                +
              </button>
            </>
          );
        } else {
          return (
            <button
              onClick={() => addToCart(item.id)}
              className="py-2 px-4 bg-[#0092FF] hover:bg-[#0073CC] text-white rounded-md flex items-center hover:shadow-md"
            >
              <FaShoppingCart className="mr-2" />
              Add
            </button>
          );
        }
      };
     
     return (
     <>
        {(loading) ? (
        <div>
          <div className="bg-gray-50 px-10 pt-10 pb-20 mt-6 mb-20 text-white w-[80%] mx-auto rounded-xl border border-gray-100">
            <Loader />
          </div>
        </div>
      ): (
        <div key={item.id} className="mb-32 mt-7 px-4 sm:px-10 lg:px-20 xl:px-52" >
    <div
        className="px-6 py-4 rounded-lg shadow-sm border border-gray-200 flex flex-col hover:shadow-lg text-black h-auto"
    >
    <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-96  rounded-md mb-4"
                />
                <div className="font-bold text-xl my-2">{item.title}</div>
                <div className="text-gray-700 mb-4 h-10">
                  {item.description}
                </div>
                <div className="flex flex-row justify-between items-center w-full text-lg mb-4">
                  <div className="text-gray-500">₹{item.amount}</div>
                  {item.visibility ? (
                    <div className="flex flex-row items-center justify-center">
                      {<RenderCartControls item={item}></RenderCartControls>}
                    </div>
                  ) : (
                    <div className="text-red-500 font-semibold">
                      Out of Stock
                    </div>
                  )}
                </div>
              </div>  </div>)
        }
</> ) }