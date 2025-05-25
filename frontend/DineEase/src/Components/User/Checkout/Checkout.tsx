import axios from "axios";
import { Banknote, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AppAppBar from "../Home/AppAppBar";
import Footer from "../Home/Footer";
import { NavigateOptions } from 'react-router-dom';


interface fields {
  storeId: any;
  addressId:number;
  paymentMethod: string;
  description: string;
}

interface Address{
    id:number;
    state:string;
    houseStreet:string;
    pincode:string;
}

interface Props {
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
  navigate: (to: string, options?: NavigateOptions) => void;
  setError: React.Dispatch<React.SetStateAction<string>>;
}


interface Item {
  id: number;
  quantity: number;
  price: number;
  title: string;
  imageUrl: string;
  visibility: boolean;
  storeId:string;
}

interface OutItem {
  id: number;
  title: string;
}

const OutOfStockModal = ({
  isOpen,
  onClose,
  items,
}: {
  isOpen: boolean;
  onClose: () => void;
  items: OutItem[];
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Out of Stock Items</h2>
        <div className="bg-[#EAF8FF] border-l-4 border-[#0092FF] p-4 mb-4">
          <p className="font-bold">Some items are out of stock</p>
          <p>
            The following items are no longer available and have been removed
            from your cart:
          </p>
          <ul className="list-disc list-inside mt-2">
            {items.map((item: OutItem, index: number) => (
              <li key={index}>{item.title}</li>
            ))}
          </ul>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full  text-white py-2 px-4 rounded bg-[#0092FF] hover:bg-[#0073CC] transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export function Checkout() {
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [addresses,setAddresses]=useState<Address[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [outOfStockModal, setOutOfStockModal] = useState(false);
  const [outOfStockItems, setOutOfStockItems] = useState<OutItem[]>([]);
  const [buttonstate, setbuttonstate] = useState(true);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<fields>({});
  
  const method = watch("paymentMethod");
  const shipping = parseInt(import.meta.env.VITE_SHIPPING_COST as string);
  const codcharges = parseInt(import.meta.env.VITE_COD as string);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    
    const itemstemp = localStorage.getItem("cart");
    if (!itemstemp || Object.keys(JSON.parse(itemstemp)).length === 0) {
      setError("No Items Added to Cart");
      setLoading(false);
      toast.error("Redirecting to menu...",{id: "redirect-toast",duration:3000});

      setTimeout(() => {
      navigate("../menu")
      }, 3000);

      return;
    }

    const itemsbody = JSON.parse(itemstemp);
    let n = Object.keys(itemsbody).length;
    const itemsarr: Item[] = [];
    const outOfStock: OutItem[] = [];
    let temp = 0;
    let invalid=0;
    let token=localStorage.getItem("token");
    if (token===null || token===undefined){
        navigate("/signin");
        setError("Unauthorized please signin again");
        return;
    }
    let store=localStorage.getItem("storeId");
    if (store===null || store===undefined || store===""){
        navigate("/menu");
        setError("Store unselected");
        return;
    }
    let currentStoreId=store;

const fetchItems = Object.keys(itemsbody).map(async (key) => {
  try {
    const temp1: Item = {
      id: 0,
      quantity: 0,
      title: "",
      imageUrl: "",
      price: 0,
      visibility: true,
      storeId:"",
    };
    const id = parseInt(key);
    const quantity = itemsbody[key];

    let response;

    try {
      const url= import.meta.env.VITE_API_URL || import.meta.env.VITE_DOCKER_URL || 'http://localhost:3000/';
      response = await axios.get(
        `${url}api/v1/user/viewmenuitem?itemId=${id}`
      );
    } catch (error) {
      // toast.error("Signin to proceed", { id: "auth-failed-toast" });
      // navigate("/signin");
      toast.error("Something went wrong , Please try again later")
      navigate("/error");
      return;
    }

    const body = response.data;
    const itemStoreId = body.storeId;
    if (currentStoreId !== itemStoreId) {
      delete itemsbody[key];
      localStorage.setItem("cart", JSON.stringify(itemsbody));
      toast.error("Some items are from different store and are removed" , {id:"store-mismatch-error"})
    }
    temp1.id = id;
    temp1.price = body.amount;
    temp1.imageUrl = body.imageUrl;
    temp1.quantity = quantity;
    temp1.title = body.title;
    temp1.visibility = body.visibility;
    temp1.storeId=body.storeId;

    if (temp1.quantity <= 0) {
      delete itemsbody[key];
      localStorage.setItem("cart", JSON.stringify(itemsbody));
      invalid++;
    } else if (temp1.visibility) {
      itemsarr.push(temp1);
      temp += temp1.price * temp1.quantity;
    } else {
      outOfStock.push({ id: temp1.id, title: temp1.title });
      delete itemsbody[key];
      localStorage.setItem("cart", JSON.stringify(itemsbody));
    }
  } catch (err) {
    delete itemsbody[key];
    localStorage.setItem("cart", JSON.stringify(itemsbody));
  }
});
    Promise.all(fetchItems).then(async () => {
      try{
        if (itemsarr.length === 0) {
            setError("Selected items are no longer available");
            setLoading(false);
            return;
        }
        if (itemsarr.length + invalid != n) {
            //DISPLAY A MODAL THAT SOME ITEMS ARE NOT AVAILABLE
            setOutOfStockItems(outOfStock);
            setOutOfStockModal(true);
        }
        const url= import.meta.env.VITE_API_URL || import.meta.env.VITE_DOCKER_URL || 'http://localhost:3000/';
        const body=await axios.get(`${url}api/v1/user/getaddresses`,{
            headers:{
                Authorization:token
            }
        })
        setAddresses(body.data.addresses);
        setItems(itemsarr);
        setSubtotal(temp);
        const total = temp + shipping + (method === "COD" ? codcharges : 0);
        setTax(Math.round(total * (parseInt(import.meta.env.VITE_TAX_RATE as string) / 100)));
        setLoading(false);
      }catch(err){
        // console.log(err)
        setError("Internal server Error , Please try again later");
        navigate("/error");
        return;
      }
    });
  }, []);

  //THIS LOGIC SHOULD ONLY RUN ON UPDATES ON METHODS
  //INITIAL MOUNTING HAS ALREADY BEEN RESOLVED IN OTHER useEffect
  useEffect(() => {
    if (!loading) {
      setTax(
        Math.round((parseInt(import.meta.env.VITE_TAX_RATE as string) * (subtotal + shipping + (method == "COD" ? codcharges : 0))) / 100)
      );
    }
  }, [method]);

  async function submithandler(data: fields) {
    setbuttonstate(false);
    let token=localStorage.getItem("token");
    if (token===null || token===undefined){
        toast.error("Unauthorized please signin again",{id:"auth-error-toast"});
        navigate("/signin");
        setError("Unauthorized please signin again");
        return;
    }
    const temp=data;
    temp.addressId=Number(temp.addressId);
    // console.log(temp);
    try{
      let store=localStorage.getItem("storeId");
      if (store===null || store===undefined || store===""){
        navigate("/menu");
        setError("Store unselected");
        return;
    }
    let currentStoreId=store;
    const url= import.meta.env.VITE_API_URL || import.meta.env.VITE_DOCKER_URL || 'http://localhost:3000/';
    let response=await axios.post(`${url}api/v1/user/checkout`, {
        addressId:temp.addressId,
        storeId:currentStoreId,
        description: temp.description,
        paymentMethod: temp.paymentMethod,
        amount: Math.round(
          subtotal +
            (method === "COD" ? codcharges : 0) +
            parseInt(import.meta.env.VITE_SHIPPING_COST as string) +
            tax
        ),
        items: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      },{
        headers:{
            Authorization:token
        }
      })
      
        let body = response.data;
        if (body.message === "Order placed successfully") {
          const id = body.orderId;
          toast.success(`Order placed successfully! Order ID: ${id}`, {
            duration: 5000,
            id : "order-success-toast"
          });
          localStorage.setItem("cart","{}");
          setTimeout(() => {
            navigate("/dashboard") // change later 
          }, 1000);
        } else {
          setError("Unable to place order");
        }
        //ORDER PLACED SUCCESSFULLY TOAST
    }catch(err){
        setError("Unable to place order");
        navigate("/error");
        return;
    }
     // setbuttonstate(true);
  }

  if (loading) {
    return (
      <>
      <AppAppBar></AppAppBar>
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-[#33A8FF]" />
      </div>
      <Footer></Footer>
      </>
    );
  } else if (error != "") {
    return (
      <>
      <AppAppBar></AppAppBar>
      <div className="flex items-center justify-center h-screen">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
      <Footer></Footer>
      </>
    );
  }

  return (
    <>
    <AppAppBar></AppAppBar>
      <form onSubmit={handleSubmit(submithandler)}>
        <div className="mb-32 mt-7">
          <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32 gap-8">
            <div className="px-4 pt-4">
              <p className="text-xl font-medium">Order Summary</p>
              <p className="text-gray-400">
                Check your items. And select a suitable shipping method.
              </p>
              <div className="mt-8 space-y-3 rounded-lg border bg-[#EAF8FF] px-2 py-4 sm:px-6 border-gray-300">
                {items.map((item: Item) => {
                  return (
                    <div
                      className="flex flex-col rounded-lg bg-[#EAF8FF] sm:flex-row"
                      key={item.id}
                    >
                      <img
                        className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                        src={item.imageUrl}
                        alt=""
                      />
                      <div className="flex w-full flex-col px-4 py-4">
                        <span className="font-semibold">{item.title}</span>
                        <span className="float-right text-gray-400">
                          Quantity added {item.quantity}
                        </span>
                        <span className="float-right text-gray-400">
                          Unit price ₹ {item.price}
                        </span>
                        <p className="text-lg font-bold">
                          ₹ {item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-8 text-lg font-medium">Payment Methods</p>
              <div className="mt-5 grid gap-6">
                <div className="relative">
                  <input
                    className="peer hidden"
                    id="radio_1"
                    type="radio"
                    value="UPI"
                    {...register("paymentMethod")}
                    defaultChecked
                  />
                  <span className="peer-checked:border-[#33A8FF] absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                  <label
                    className="peer-checked:border peer-checked:border-[#33A8FF] peer-checked:bg-[#EAF8FF] flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                    htmlFor="radio_1"
                  >
                    <img
                      className="w-14 object-contain"
                      src="https://cdn.iconscout.com/icon/free/png-256/free-upi-logo-icon-download-in-svg-png-gif-file-formats--unified-payments-interface-payment-money-transfer-logos-icons-1747946.png"
                      alt=""
                    />
                    <div className="ml-5">
                      <span className="mt-2 font-semibold">UPI</span>
                      <p className="text-slate-500 text-sm leading-6">
                        Pay by any UPI app on below QR Code
                      </p>
                    </div>
                  </label>
                </div>

                <div className="relative">
                  <input
                    className="peer hidden"
                    id="radio_2"
                    type="radio"
                    value="COD"
                    {...register("paymentMethod")}
                  />
                  <span className="peer-checked:border-[#33A8FF] absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                  <label
                    className="peer-checked:border peer-checked:border-[#33A8FF] peer-checked:bg-[#EAF8FF] flex items-center cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                    htmlFor="radio_2"
                  >
                    <Banknote className="me-3 ms-4 text-[#33A8FF]" />
                    <div className="ml-5">
                      <span className="mt-2 font-semibold">
                        Cash On Delivery
                      </span>
                      <p className="text-slate-500 text-sm leading-6">
                        +₹ 40 COD charge
                      </p>
                    </div>
                  </label>
                </div>

                {/* <div className="relative">
                  <input
                    className="peer hidden"
                    id="radio_3"
                    type="radio"
                    value="StorePayment"
                    {...register("paymentMethod")}
                  />
                  <span className="peer-checked:border-green-600 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                  <label
                    className="peer-checked:border peer-checked:border-green-500 peer-checked:bg-green-50 flex items-center cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                    htmlFor="radio_3"
                  > */}
                    {/* <Store className="me-3 ms-4 text-green-600" />
                    <div className="ml-5">
                      <span className="mt-2 font-semibold">Pickup</span>
                      <p className="text-slate-500 text-sm leading-6">
                        Pay and pickup at store
                      </p>
                    </div> */}
                  {/* </label>
                </div> */}
              </div>
            </div>
            
            <div className="mt-10 bg-[#EAF8FF] px-6 pt-8 lg:mt-0 rounded-lg h-fit border border-gray-300">
              <p className="text-xl font-medium">Shipping Details</p>
              <p className="text-gray-400">
                Complete your order by providing your shipping details.
              </p>


              <div className="mt-3 grid gap-3">
              {addresses.map((item)=>{
                return (
                    <div key={item.id}>
                        <div className="relative">
                            <input
                            className="peer hidden"
                            id={`radio_addr_${item.id}`}
                            type="radio"
                            value={item.id}
                            {...register("addressId", { required:true })}
                            
                            />
                            <span className="peer-checked:border-[#33A8FF] absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                            <label
                                className="peer-checked:border peer-checked:border-[#33A8FF] peer-checked:bg-[#EAF8FF]  flex items-center cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                                htmlFor={`radio_addr_${item.id}`}
                            >
                            <div className="ml-5">
                                <span className="mt-2 font-semibold">
                                    {item.houseStreet}
                                </span>
                                <p className="text-slate-500 text-sm leading-6">
                                 {`${item.state},${item.pincode}`}
                                </p>
                            </div>
                            </label>
                        </div>
                    </div>
                )
              })}
              </div>
              
               <AddAddress navigate={navigate} setError={setError} setAddresses={setAddresses}></AddAddress> 
        
            
            
               

              {/* <div className="relative">
                  <input
                    className="peer hidden"
                    id="radio_2"
                    type="radio"
                    value=""
                    {...register("addressId")}
                  />
                  <span className="peer-checked:border-green-600 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                  <label
                    className="peer-checked:border peer-checked:border-green-500 peer-checked:bg-green-50 flex items-center cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                    htmlFor="radio_2"
                  > */}
                    {/* <Banknote className="me-3 ms-4 text-green-600" /> */}
                    {/* <div className="ml-5">
                      <span className="mt-2 font-semibold">
                        Cash On Delivery
                      </span>
                      <p className="text-slate-500 text-sm leading-6">
                        +₹ 40 COD charge
                      </p>
                    </div>
                  </label>
                </div> */}
                <label
                  htmlFor="card-holder"
                  className="mt-4 mb-2 block text-sm font-medium"
                >
                  Description
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="description"
                    {...register("description")}
                    defaultValue={""}
                    className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-green-500 focus:ring-green-500"
                    placeholder="Enter Description"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="h-4 w-4 text-gray-400"
                    >
                      <path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" />
                      <path d="M2 6h4" />
                      <path d="M2 10h4" />
                      <path d="M2 14h4" />
                      <path d="M2 18h4" />
                      <path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
                    </svg>
                  </div>
                </div>
              
              
              
              <div className="mt-6 border-t border-b py-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      Subtotal
                    </p>
                    <p className="font-semibold text-gray-900">₹ {subtotal}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      Shipping
                    </p>
                    <p className="font-semibold text-gray-900">
                      ₹{" "}
                      {parseInt(
                        import.meta.env.VITE_SHIPPING_COST as string
                      )}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      COD Charges
                    </p>
                    <p className="font-semibold text-gray-900">
                      {method === "COD" ? codcharges : 0}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">TAX</p>
                    <p className="font-semibold text-gray-900">₹ {tax}</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-lg font-medium text-gray-900">Total</p>
                  <p className="text-xl font-semibold text-gray-900">
                    ₹{" "}
                    {Math.round(
                      subtotal +
                        (method === "COD" ? codcharges : 0) +
                        parseInt(
                            import.meta.env.VITE_SHIPPING_COST as string
                        ) +
                        tax
                    )}
                  </p>
                </div>
              
              <button
                type="submit"
                disabled={!buttonstate}
                className={`mt-6 mb-2 w-full rounded-md px-6 py-3 font-medium text-white
                  ${buttonstate ? 'bg-[#0092FF] hover:bg-[#0073CC]' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                Place Order
                
              </button>
              {errors.addressId && (<p className="text-red-500 text-sm mt-2 text-center">Please select a shipping address</p>)}
            </div>
            
          </div>
        </div>
      </form>
      
      <OutOfStockModal
        isOpen={outOfStockModal}
        onClose={() => setOutOfStockModal(false)}
        items={outOfStockItems}
      />
      <Footer></Footer>
    </>
  );
}


function AddAddress({setAddresses,navigate,setError}:Props){
    const [houseStreet,setHouseStreet]=useState("");
    const [state,setState]=useState("Delhi");
    const [pincode,setPincode]=useState("");
    const [addressform,setAddressForm]=useState(false);
    const [invalid,setInvalid]=useState(false);

    useEffect(()=>{
        if (houseStreet==="" || pincode ===""){
            setInvalid(true);
        }
        else if (invalid){
            setInvalid(false);
        }
    },[houseStreet,pincode])
    
    async function submithandler(){
        let token=localStorage.getItem("token");
        if (token===null || token===undefined){
            setError("Unauthorized , Please signin again");
            navigate("/signin");
        }
        try{
          const url= import.meta.env.VITE_API_URL || import.meta.env.VITE_DOCKER_URL || 'http://localhost:3000/';
          let result=await axios.post(`${url}api/v1/user/addaddress`,{
            houseStreet:houseStreet,
            state:state,
            pincode:pincode
        },{
            headers:{
                Authorization:token
            }
        })
        // console.log(result);
        setAddresses((initial:Address[])=> [...initial,result.data.address]);
        setAddressForm(false);
        }
        catch(err){
            // console.log(err);
            setError("Internal Server Error");
            navigate("/error");
             return;
        }

    }
    if (!addressform){
        return (
        <div className="flex justify-center">
                <button
                    onClick={()=>{
                        setAddressForm(true);
                    }}
                    type="button"
                    className={`mt-6 mb-8  rounded-md px-6 py-3 font-medium text-white
                   bg-[#0092FF] hover:bg-[#0073CC]`}
                >
                    Add New Address
                 </button>
            </div>
        )
    }
    
    return (
        <div className="mt-5">
            <div>
            <div>
               <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-shrink-0 sm:w-7/12">
                    <input
                      type="text"
                      id="billing-address"
                      onChange={(e)=>{
                        setHouseStreet(e.target.value);
                      }}
                      className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-[#33A8FF] focus:ring-[#33A8FF]"
                      placeholder="Street Address"
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                      <img
                        className="h-4 w-4 object-contain"
                        src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"
                        alt=""
                      />
                    </div>
                  </div>
                  <select
                     onChange={(e)=>{
                        setState(e.target.value);
                      }}
                    className="w-full rounded-md border bg-white border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-[#33A8FF] focus:ring-[#33A8FF]"
                  >
                    <option selected>Delhi</option>
                    <option>Andhra Pradesh</option>
                    <option>Arunachal Pradesh</option>
                    <option>Assam</option>
                    <option>Bihar</option>
                    <option>Chhattisgarh</option>
                    <option>Gujarat</option>
                    <option>Haryana</option>
                    <option>Himachal Pradesh</option>
                    <option>Jammu and Kashmir</option>
                    <option>Goa</option>
                    <option>Jharkhand</option>
                    <option>Karnataka</option>
                    <option>Kerala</option>
                    <option>Madhya Pradesh</option>
                    <option>Maharashtra</option>
                    <option>Manipur</option>
                    <option>Meghalaya</option>
                    <option>Mizoram</option>
                    <option>Nagaland</option>
                    <option>Odisha</option>
                    <option>Punjab</option>
                    <option>Rajasthan</option>
                    <option>Sikkim</option>
                    <option>Tamil Nadu</option>
                    <option>Telangana</option>
                    <option>Tripura</option>
                    <option>Uttarakhand</option>
                    <option>Uttar Pradesh</option>
                    <option>West Bengal</option>
                    <option>Andaman and Nicobar Islands</option>
                    <option>Chandigarh</option>
                    <option>Dadra and Nagar Haveli</option>
                    <option>Daman and Diu</option>
                    <option>Lakshadweep</option>
                    <option>Puducherry</option>
                  </select>
                  <input
                    type="text"
                    onChange={(e)=>{
                        setPincode(e.target.value);
                      }}
                    className="flex-shrink-0 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none sm:w-1/6 focus:z-10 focus:border-[#33A8FF] focus:ring-[#33A8FF]"
                    placeholder="Pin Code"
                  />
                </div>

                {invalid && 
                    <div className="flex justify-center">
                        <div className="text-red-600">Please Fill Required fields</div>
                    </div>
                }

                
                
                </div>
                <div className="flex justify-center">
                <button
                    type="button"
                    onClick={submithandler}
                    className={`mt-6 mb-8  rounded-md px-6 py-3 font-medium text-white
                   bg-[#0092FF] hover:bg-[#0073CC]`}
                >
                    Save address
                 </button>
            </div>
        </div>
    </div>
    )
}