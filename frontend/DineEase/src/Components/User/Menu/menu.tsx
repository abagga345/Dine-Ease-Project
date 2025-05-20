import { useEffect, useState } from "react";
import Loader from "../../common/Loader";
import { FaShoppingCart } from "react-icons/fa";
import AppAppBar from "../Home/AppAppBar";
import Footer from "../Home/Footer";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface MenuItem {
  id: number;
  title: string;
  description: string;
  amount: number;
  imageUrl: string;
  visibility: boolean;
}

type Cart = {
  [key: number]: number;
};

export const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<{
    [key: number]: boolean;
  }>({});
  const [cart, setCart] = useState<Cart>({});

  useEffect(() => {
    const store = localStorage.getItem("storeId");
    if (store===null || store===undefined || store==="") {
        navigate("/store");
        return;
    }
    const fetchMenuItems = async () => {
      try {
        const store = localStorage.getItem("storeId");
        const res = await fetch(`http://localhost:3000/api/v1/user/viewmenu?storeId=${store}`);
        const data = await res.json();
        setMenuItems(data.items);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
        toast.error("Failed to fetch menu items")
        navigate("/");
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

  const getShortDescription = (description: string) => {
    const wordLimit = 10;
    const words = description.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : description;
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

  const renderCartControls = (item: MenuItem) => {
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
      <AppAppBar></AppAppBar>
    {(loading) ? (
    <div>
      <div className="font-semibold text-2xl w-full text-center my-4">Menu</div>
      <div className="bg-gray-50 px-10 pt-10 pb-20 mt-6 mb-20 text-white w-[80%] mx-auto rounded-xl border border-gray-100">
        <Loader />
      </div>
    </div>
  ) : (
    <div>
      <div className="font-semibold text-3xl w-full text-center my-4">Menu</div>
      <div className="bg-gray-50 px-10 pt-10 pb-20 mt-6 mb-20 text-white w-[80%] mx-auto rounded-xl border border-gray-100">
        {menuItems.length === 0 ? (
          <div className="text-center text-black font-semibold text-lg">
            No menu items available. Check Back Later...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-white px-6 py-4 rounded-lg shadow-sm border border-gray-200 flex flex-col hover:shadow-lg text-black h-auto"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-64 object-cover rounded-md mb-4"
                />
                <div className="font-bold text-xl my-2">{item.title}</div>
                <div className="text-gray-700 mb-4 h-10">
                  {getShortDescription(item.description)}
                  {/* {item.description.split(" ").length > 10 && (
                        <button
                          onClick={() => navigate(`/menuitem/${item.id}`)}
                          className="text-blue-500 ml-2"
                        >
                          Read More
                        </button>
                  )} */}
                  </div>
                <div className="flex flex-row justify-between items-center w-full text-lg mb-4">
                  <div className="text-gray-500">₹{item.amount}</div>
                  
                  <button
                  onClick={() => navigate(`/menuitem/${item.id}`)}
                  className="py-2 px-4 bg-[#0092FF] hover:bg-[#0073CC] text-white rounded-md flex items-center hover:shadow-md"
                  >
                  View Item
                  </button>

                  {item.visibility ? (
                    <div className="flex flex-row items-center justify-center">
                      {renderCartControls(item)}
                    </div>
                  ) : (
                    <div className="text-red-500 font-semibold">
                      Out of Stock
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    )};
    <Footer></Footer>
    </>
  )
};