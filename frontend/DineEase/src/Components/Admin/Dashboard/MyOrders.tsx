import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Clock,
  MapPin,
  Package,
  User,
  Info,
  MapPinHouse,
} from "lucide-react";
import Loader from "../../common/Loader";
import { useNavigate } from "react-router-dom";
import { Card } from "../../common/ui/Card";
import { Badge } from "../../common/ui/Badge";

const statusTone = (
  status: string
): "maroon" | "turmeric" | "terracotta" | "muted" | "danger" => {
  switch (status) {
    case "Delivered":
      return "maroon";
    case "Processing":
    case "Dispatched":
      return "turmeric";
    case "Unconfirmed":
      return "terracotta";
    case "Rejected":
      return "danger";
    default:
      return "muted";
  }
};

interface OrderItem {
    item: {
      title: string;
      amount: number;
    };
    quantity: number;
    itemId:number;
  }
  
  interface Address{
      houseStreet:String;
      state:String;
      pincode:String;
  }
  
  interface StoreAddress{
    storeStreet:string;
    state:string;
    pincode:string;
    storeId:string;
  }


  interface Order {
    id: string;
    email: string;
    status: string;
    creationDate: string;
    items: OrderItem[];
    description?: string;
    address:Address;
    store:StoreAddress;
  //   paymentMethod: string;
  }


export const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate=useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const toastId = toast.loading("Loading orders...",{id:"load-order-toast"});
      let token=localStorage.getItem("token")
      if (token===null || token===undefined){
        toast.error("Unauthorized , Please Signin again",{id:"auth-error-toast"});
        setError("Unauthorized , Please signin again");
        navigate("./user/signin")
        return;
      }


      try {
        const url= import.meta.env.VITE_API_URL || import.meta.env.VITE_DOCKER_URL || 'https://dine-ease.coderspro.xyz/';
        const response = await fetch(`${url}api/v1/user/vieworders`,{
            headers:{
                Authorization:token
            }
        });

        toast.dismiss(toastId);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        // // console.log(data.orders);
        if (data.orders.length == 0) {
          toast.error("No Orders Placed Yet",{id:"no-order-toast"});
        } else {
          toast.success("Orders loaded successfully!", { id: toastId });
        }
        setOrders(data.orders);
      } catch (error: any) {
        setError(error.message);
        toast.error(`Error: ${error.message}`, { id: toastId });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-serif font-bold mb-10 text-brand-maroon text-center">
        My Orders
      </h1>
      <div className="md:grid md:grid-cols-2 gap-8">
        {orders.map((order) => (
          <Card
            key={order.id}
            className="overflow-hidden mb-10"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-serif font-semibold text-brand-maroon">
                  Order #{order.id}
                </h2>
                <Badge tone={statusTone(order.status)}>{order.status}</Badge>
              </div>
              <hr className="my-4 border-brand-cream-dark" />
              <div className="mb-4">
                <div className="flex items-center mb-1">
                  <User className="w-5 h-5 mr-2 text-brand-terracotta" />
                  <span className="text-brand-ink-soft">{order.email}</span>
                </div>
                <div className="flex items-center mb-1">
                  <Clock className="w-5 h-5 mr-2 text-brand-terracotta" />
                  <span className="text-brand-ink-soft">
                    {new Date(order.creationDate).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPinHouse className="w-5 h-5 mr-2 text-brand-terracotta" />
                  <span className="text-brand-ink-soft w-full">{`${order.address.houseStreet}, ${order.address.state},  ${order.address.pincode}`}</span>
                </div>
                <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-brand-terracotta" />
                <span className="text-brand-ink-soft w-full">{`${order.store.storeStreet}, ${order.store.state},  ${order.store.pincode}`}</span>

                </div>
                {/* <div className="flex items-center">
                  <Wallet className="w-5 h-5 mr-2 text-green-600" />
                  <span className="text-gray-600 w-full">
                    {order.paymentMethod}
                  </span>
                </div> */}
              </div>
              <div className="border-t border-brand-cream-dark pt-4">
                <h3 className="text-lg font-serif font-semibold mb-2 text-brand-maroon">
                  Order Items
                </h3>
                <ul className="space-y-2">
                  {order.items.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <Package className="w-5 h-5 mr-2 text-brand-terracotta" />
                        <span className="text-brand-ink">{item.item.title}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-brand-ink-soft">
                          Qty: {item.quantity}
                        </span>
                        <span className="ml-4 text-brand-ink font-medium">
                          ₹{item.item.amount * item.quantity}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              {order.description && (
                <div className="mt-4 p-3 rounded-lg bg-brand-cream border border-brand-cream-dark">
                  <span className="text-brand-ink font-medium flex items-center">
                    <Info className="w-5 h-5 mr-2 text-brand-ink-soft" />
                    Note: {order.description}
                  </span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};