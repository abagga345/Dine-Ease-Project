import axios from "axios";
import { Banknote, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, NavigateOptions } from "react-router-dom";
import AppAppBar from "../Home/AppAppBar";
import Footer from "../Home/Footer";
import Loader from "../../common/Loader";
import { Container } from "../../common/ui/Container";
import { Card } from "../../common/ui/Card";
import { Button } from "../../common/ui/Button";
import { Input } from "../../common/ui/Input";
import { Select } from "../../common/ui/Select";
import { RadioCard } from "../../common/ui/RadioCard";
import { Modal } from "../../common/ui/Modal";
import { apiUrl, numEnv } from "../../../config/api";

interface fields {
  storeId: any;
  addressId: number;
  paymentMethod: string;
  description: string;
}

interface Address {
  id: number;
  state: string;
  houseStreet: string;
  pincode: string;
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
  storeId: string;
}

interface OutItem {
  id: number;
  title: string;
}

const INDIAN_STATES = [
  "Delhi","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Gujarat","Haryana",
  "Himachal Pradesh","Jammu and Kashmir","Goa","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim",
  "Tamil Nadu","Telangana","Tripura","Uttarakhand","Uttar Pradesh","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli","Daman and Diu","Lakshadweep",
  "Puducherry",
];

const OutOfStockModal = ({
  isOpen,
  onClose,
  items,
}: {
  isOpen: boolean;
  onClose: () => void;
  items: OutItem[];
}) => (
  <Modal open={isOpen} onClose={onClose} title="Some items are out of stock">
    <p className="text-brand-ink-soft">
      The following items are no longer available and have been removed from your cart:
    </p>
    <ul className="mt-3 list-inside list-disc text-brand-ink">
      {items.map((item, index) => (
        <li key={index}>{item.title}</li>
      ))}
    </ul>
    <Button className="mt-5" fullWidth onClick={onClose}>
      Continue
    </Button>
  </Modal>
);

export function Checkout() {
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
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
  const shipping = numEnv(import.meta.env.VITE_SHIPPING_COST);
  const codcharges = numEnv(import.meta.env.VITE_COD);
  const taxRate = numEnv(import.meta.env.VITE_TAX_RATE);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    const itemstemp = localStorage.getItem("cart");
    if (!itemstemp || Object.keys(JSON.parse(itemstemp)).length === 0) {
      setError("No Items Added to Cart");
      setLoading(false);
      toast.error("Redirecting to menu...", { id: "redirect-toast", duration: 3000 });
      setTimeout(() => navigate("../menu"), 3000);
      return;
    }

    const itemsbody = JSON.parse(itemstemp);
    let n = Object.keys(itemsbody).length;
    const itemsarr: Item[] = [];
    const outOfStock: OutItem[] = [];
    let temp = 0;
    let invalid = 0;
    let token = localStorage.getItem("token");
    if (token === null || token === undefined) {
      navigate("/signin");
      setError("Unauthorized please signin again");
      return;
    }
    let store = localStorage.getItem("storeId");
    if (store === null || store === undefined || store === "") {
      navigate("/menu");
      setError("Store unselected");
      return;
    }
    let currentStoreId = store;

    const fetchItems = Object.keys(itemsbody).map(async (key) => {
      try {
        const temp1: Item = {
          id: 0,
          quantity: 0,
          title: "",
          imageUrl: "",
          price: 0,
          visibility: true,
          storeId: "",
        };
        const id = parseInt(key);
        const quantity = itemsbody[key];

        let response;
        try {
          response = await axios.get(apiUrl(`user/viewmenuitem?itemId=${id}`));
        } catch (error) {
          toast.error("Something went wrong , Please try again later");
          navigate("/error");
          return;
        }

        const body = response.data;
        const itemStoreId = body.storeId;
        if (currentStoreId !== itemStoreId) {
          delete itemsbody[key];
          localStorage.setItem("cart", JSON.stringify(itemsbody));
          toast.error("Some items are from different store and are removed", {
            id: "store-mismatch-error",
          });
        }
        temp1.id = id;
        temp1.price = body.amount;
        temp1.imageUrl = body.imageUrl;
        temp1.quantity = quantity;
        temp1.title = body.title;
        temp1.visibility = body.visibility;
        temp1.storeId = body.storeId;

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
      try {
        if (itemsarr.length === 0) {
          setError("Selected items are no longer available");
          setLoading(false);
          return;
        }
        if (itemsarr.length + invalid != n) {
          setOutOfStockItems(outOfStock);
          setOutOfStockModal(true);
        }
        const body = await axios.get(apiUrl("user/getaddresses"), {
          headers: { Authorization: token },
        });
        setAddresses(body.data.addresses);
        window.dispatchEvent(new Event("cart-updated"));
        setItems(itemsarr);
        setSubtotal(temp);
        const total = temp + shipping + (method === "COD" ? codcharges : 0);
        setTax(Math.round(total * (taxRate / 100)));
        setLoading(false);
      } catch (err) {
        setError("Internal server Error , Please try again later");
        navigate("/error");
      }
    });
  }, []);

  // Recompute tax when payment method changes (initial mount handled above).
  useEffect(() => {
    if (!loading) {
      setTax(Math.round((taxRate * (subtotal + shipping + (method == "COD" ? codcharges : 0))) / 100));
    }
  }, [method]);

  async function submithandler(data: fields) {
    setbuttonstate(false);
    let token = localStorage.getItem("token");
    if (token === null || token === undefined) {
      toast.error("Unauthorized please signin again", { id: "auth-error-toast" });
      navigate("/signin");
      setError("Unauthorized please signin again");
      return;
    }
    const temp = data;
    temp.addressId = Number(temp.addressId);
    try {
      let store = localStorage.getItem("storeId");
      if (store === null || store === undefined || store === "") {
        navigate("/menu");
        setError("Store unselected");
        return;
      }
      let currentStoreId = store;
      let response = await axios.post(
        apiUrl("user/checkout"),
        {
          addressId: temp.addressId,
          storeId: currentStoreId,
          description: temp.description,
          paymentMethod: temp.paymentMethod,
          amount: Math.round(subtotal + (method === "COD" ? codcharges : 0) + shipping + tax),
          items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
        },
        { headers: { Authorization: token } }
      );

      let body = response.data;
      if (body.message === "Order placed successfully") {
        const id = body.orderId;
        toast.success(`Order placed successfully! Order ID: ${id}`, {
          duration: 5000,
          id: "order-success-toast",
        });
        localStorage.setItem("cart", "{}");
        window.dispatchEvent(new Event("cart-updated"));
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setError("Unable to place order");
        setbuttonstate(true);
      }
    } catch (err) {
      setError("Unable to place order");
      navigate("/error");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <AppAppBar />
        <Container className="py-24">
          <Loader />
        </Container>
        <Footer />
      </div>
    );
  }
  if (error != "") {
    return (
      <div className="min-h-screen bg-brand-cream">
        <AppAppBar />
        <Container className="flex min-h-[50vh] items-center justify-center py-16">
          <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4 text-red-700" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  const total = Math.round(subtotal + (method === "COD" ? codcharges : 0) + shipping + tax);

  return (
    <div className="min-h-screen bg-brand-cream">
      <AppAppBar />

      <Container className="py-10">
        <h1 className="mb-8 text-center font-serif text-3xl font-bold text-brand-maroon">Checkout</h1>

        <form onSubmit={handleSubmit(submithandler)}>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left: order summary + payment */}
            <div>
              <h2 className="font-serif text-xl font-bold text-brand-ink">Order Summary</h2>
              <p className="text-sm text-brand-ink-soft">Review your items and pick a payment method.</p>

              <Card className="mt-5 space-y-3 p-4">
                {items.map((item: Item) => (
                  <div className="flex gap-4" key={item.id}>
                    <img
                      className="h-20 w-20 rounded-lg border border-brand-cream-dark object-cover"
                      src={item.imageUrl}
                      alt={item.title}
                    />
                    <div className="flex flex-1 flex-col">
                      <span className="font-semibold text-brand-ink">{item.title}</span>
                      <span className="text-sm text-brand-ink-soft">Quantity: {item.quantity}</span>
                      <span className="text-sm text-brand-ink-soft">Unit price: ₹{item.price}</span>
                      <p className="mt-1 font-bold text-brand-maroon">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </Card>

              <h2 className="mt-8 font-serif text-lg font-bold text-brand-ink">Payment Method</h2>
              <div className="mt-4 grid gap-4">
                <RadioCard
                  id="radio_upi"
                  value="UPI"
                  inputProps={register("paymentMethod")}
                  defaultChecked
                >
                  <div className="flex items-center gap-4">
                    <img
                      className="h-8 w-12 object-contain"
                      src="https://cdn.iconscout.com/icon/free/png-256/free-upi-logo-icon-download-in-svg-png-gif-file-formats--unified-payments-interface-payment-money-transfer-logos-icons-1747946.png"
                      alt="UPI"
                    />
                    <div>
                      <p className="font-semibold text-brand-ink">UPI</p>
                      <p className="text-sm text-brand-ink-soft">Pay via any UPI app at delivery</p>
                    </div>
                  </div>
                </RadioCard>

                <RadioCard id="radio_cod" value="COD" inputProps={register("paymentMethod")}>
                  <div className="flex items-center gap-4">
                    <Banknote className="text-brand-terracotta" />
                    <div>
                      <p className="font-semibold text-brand-ink">Cash On Delivery</p>
                      <p className="text-sm text-brand-ink-soft">+₹{codcharges} COD charge</p>
                    </div>
                  </div>
                </RadioCard>
              </div>
            </div>

            {/* Right: shipping + totals */}
            <Card className="h-fit p-6">
              <h2 className="font-serif text-xl font-bold text-brand-ink">Shipping Details</h2>
              <p className="text-sm text-brand-ink-soft">Select a delivery address to complete your order.</p>

              <div className="mt-4 grid gap-3">
                {addresses.map((item) => (
                  <RadioCard
                    key={item.id}
                    id={`radio_addr_${item.id}`}
                    value={item.id}
                    inputProps={register("addressId", { required: true })}
                  >
                    <div>
                      <p className="font-semibold text-brand-ink">{item.houseStreet}</p>
                      <p className="text-sm text-brand-ink-soft">{`${item.state}, ${item.pincode}`}</p>
                    </div>
                  </RadioCard>
                ))}
              </div>

              <AddAddress navigate={navigate} setError={setError} setAddresses={setAddresses} />

              <div className="mt-4">
                <Input
                  label="Order note (optional)"
                  placeholder="Any delivery instructions…"
                  icon={<FileText size={16} />}
                  {...register("description")}
                  defaultValue={""}
                />
              </div>

              <div className="mt-6 space-y-2 border-y border-brand-cream-dark py-4 text-sm">
                <Row label="Subtotal" value={`₹ ${subtotal}`} />
                <Row label="Shipping" value={`₹ ${shipping}`} />
                <Row label="COD Charges" value={`₹ ${method === "COD" ? codcharges : 0}`} />
                <Row label="Tax" value={`₹ ${tax}`} />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-lg font-medium text-brand-ink">Total</p>
                <p className="font-serif text-2xl font-bold text-brand-maroon">₹ {total}</p>
              </div>

              <Button type="submit" fullWidth size="lg" className="mt-6" disabled={!buttonstate}>
                Place Order
              </Button>
              {errors.addressId && (
                <p className="mt-2 text-center text-sm text-red-600">Please select a shipping address</p>
              )}
            </Card>
          </div>
        </form>
      </Container>

      <OutOfStockModal
        isOpen={outOfStockModal}
        onClose={() => setOutOfStockModal(false)}
        items={outOfStockItems}
      />
      <Footer />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <p className="font-medium text-brand-ink-soft">{label}</p>
      <p className="font-semibold text-brand-ink">{value}</p>
    </div>
  );
}

function AddAddress({ setAddresses, navigate, setError }: Props) {
  const [houseStreet, setHouseStreet] = useState("");
  const [state, setState] = useState("Delhi");
  const [pincode, setPincode] = useState("");
  const [addressform, setAddressForm] = useState(false);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (houseStreet === "" || pincode === "") setInvalid(true);
    else if (invalid) setInvalid(false);
  }, [houseStreet, pincode]);

  async function submithandler() {
    let token = localStorage.getItem("token");
    if (token === null || token === undefined) {
      setError("Unauthorized , Please signin again");
      navigate("/signin");
    }
    try {
      let result = await axios.post(
        apiUrl("user/addaddress"),
        { houseStreet, state, pincode },
        { headers: { Authorization: token } }
      );
      setAddresses((initial: Address[]) => [...initial, result.data.address]);
      setAddressForm(false);
    } catch (err) {
      setError("Internal Server Error");
      navigate("/error");
    }
  }

  if (!addressform) {
    return (
      <div className="mt-5">
        <Button type="button" variant="outline" onClick={() => setAddressForm(true)}>
          + Add New Address
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-xl border border-brand-cream-dark bg-brand-cream p-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Street Address"
          className="sm:flex-1"
          onChange={(e) => setHouseStreet(e.target.value)}
        />
        <Select value={state} onChange={(e) => setState(e.target.value)} className="sm:w-44">
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Input placeholder="Pin Code" className="sm:w-28" onChange={(e) => setPincode(e.target.value)} />
      </div>
      {invalid && <p className="mt-2 text-center text-sm text-red-600">Please fill required fields</p>}
      <div className="mt-4">
        <Button type="button" onClick={submithandler}>
          Save Address
        </Button>
      </div>
    </div>
  );
}
