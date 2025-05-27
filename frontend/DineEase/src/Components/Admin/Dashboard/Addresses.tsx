import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillEdit } from "react-icons/ai";
import { ImBin } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { NavigateOptions } from 'react-router-dom';

interface Field {
  houseStreet: string;
  state: string;
  pincode: string;
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

export function Addresses() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [open, setOpen] = useState(0);
  const navigate = useNavigate();
  const [newVal, setNewVal] = useState<Field>({
    houseStreet: "",
    state: "",
    pincode: "",
  });

  async function deletehandler(addressId: number) {
    let token = localStorage.getItem("token");
    let id = toast.loading("Loading...");
    if (token === null) {
      setError("Unauthorized , Please signin again");
      toast.error(`Error: Unauthorized , Please Signin again`, { id });
      navigate("/signin");
      return;
    }
    try {
      const url= import.meta.env.VITE_API_URL || import.meta.env.VITE_DOCKER_URL || 'http://localhost:3000/';
      await axios.delete(
        `${url}api/v1/user/deleteaddress?id=${addressId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setAddresses(addresses.filter((item) => item.id !== addressId));
      toast.success("Address updated successfully!", { id });
    } catch (error: any) {
      setError(error.message);

      toast.error(`Error: ${error.message}`, { id });
    }
  }

  async function submithandler() {
    let token = localStorage.getItem("token");
    let id = toast.loading("Loading...");

    if (token === null) {
      setError("Unauthorized , Please signin again");
      toast.error(`Error: Unauthorized , Please Signin again`, { id });
      navigate("/signin");
      return;
    }
    try {
      const url= import.meta.env.VITE_API_URL || import.meta.env.VITE_DOCKER_URL || 'http://localhost:3000/';
      const result = await axios.put(
        `${url}api/v1/user/editaddress?id=${open}`,
        newVal,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setAddresses(
        addresses.map((item) => {
          if (item.id == open) {
            (item.houseStreet = result.data["houseStreet"]),
              (item.state = result.data["state"]),
              (item.pincode = result.data["pincode"]);
          }
          return item;
        })
      );
      setOpen(0);
      toast.success("Address updated successfully!", { id });
    } catch (error: any) {
      setError(error.message);
      toast.error(`Error: ${error.message}`, { id });
    }
  }

  useEffect(() => {
    let token = localStorage.getItem("token");
    let id = toast.loading("Loading...");
    if (token === null) {
      setError("Unauthorized , Please signin again");
      toast.error(`Error: Unauthorized , Please Signin again`, { id });
      navigate("/signin");
      return;
    }

    async function fetchaddress() {
      try {
        const url= import.meta.env.VITE_API_URL || import.meta.env.VITE_DOCKER_URL || 'http://localhost:3000/';
        let result = await axios.get(
          `${url}api/v1/user/getaddresses`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setAddresses(result.data.addresses);
        toast.success("Addresses loaded successfully!", { id });
      } catch (error: any) {
        setError(error.message);
        toast.error(`Error: ${error.message}`, { id });
      } finally {
        setLoading(false);
      }
    }

    fetchaddress();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="font-semibold text-3xl w-full text-center my-4">
        Saved Addresses
      </div>

      <div className="bg-gray-50 px-10 pt-10 pb-20 mt-6 mb-20 w-[80%] mx-auto rounded-xl border border-gray-100">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-10 h-10 animate-spin text-[#33A8FF]" />
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="mt-3 grid gap-3">
              {addresses.map((item) => (
                <div key={item.id}>
                  <div className="relative">
                    <div className="border-[#33A8FF] bg-[#EAF8FF] flex items-center justify-between cursor-pointer select-none rounded-lg border p-4">
                      <div className="ml-5 flex flex-col gap-3">
                        <input
                          type="text"
                          disabled={item.id !== open}
                          className="mt-2 font-semibold p-1 rounded-lg border border-gray-300 focus:border-[#33A8FF] focus:ring-[#33A8FF]"
                          value={
                            item.id !== open
                              ? item.houseStreet
                              : newVal.houseStreet
                          }
                          onChange={(e) => {
                            setNewVal((cur) => ({
                              ...cur,
                              houseStreet: e.target.value,
                            }));
                          }}
                        />
                        <div className="flex gap-2">
                          <select
                            disabled={item.id !== open}
                            className="text-slate-500 text-sm leading-6 p-1 rounded-lg border border-gray-300 focus:border-[#33A8FF] focus:ring-[#33A8FF]"
                            value={item.id !== open ? item.state : newVal.state}
                            onChange={(e) => {
                              setNewVal((cur) => ({
                                ...cur,
                                state: e.target.value,
                              }));
                            }}
                          >
                            <option value="">Select State</option>
                            <option>Andhra Pradesh</option>
                            <option>Arunachal Pradesh</option>
                            <option>Assam</option>
                            <option>Bihar</option>
                            <option>Chhattisgarh</option>
                            <option>Delhi</option>
                            <option>Goa</option>
                            <option>Gujarat</option>
                            <option>Haryana</option>
                            <option>Himachal Pradesh</option>
                            <option>Jammu and Kashmir</option>
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
                            disabled={item.id !== open}
                            className="text-slate-500 text-sm leading-6 p-1 rounded-lg border border-gray-300 focus:border-[#33A8FF] focus:ring-[#33A8FF]"
                            value={
                              item.id !== open ? item.pincode : newVal.pincode
                            }
                            onChange={(e) => {
                              setNewVal((cur) => ({
                                ...cur,
                                pincode: e.target.value,
                              }));
                            }}
                          />
                        </div>
                      </div>
                      {open !== item.id ? (
                        <div className="flex gap-6">
                          <button
                            onClick={() => {
                              setOpen(item.id);
                              setNewVal({
                                houseStreet: item.houseStreet,
                                state: item.state,
                                pincode: item.pincode,
                              });
                            }}
                          >
                            <div className="flex flex-row items-center gap-2">
                              <AiFillEdit />
                              Edit
                            </div>
                          </button>
                          <button
                            onClick={() => {
                              deletehandler(item.id);
                            }}
                          >
                            <div className="flex flex-row items-center gap-2">
                              <ImBin />
                            </div>
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              submithandler();
                            }}
                            type="button"
                            className="rounded-md px-2 py-2 font-medium text-white bg-[#0092FF] hover:bg-[#0073CC]"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setOpen(0);
                            }}
                            type="button"
                            className="rounded-md px-2 py-2 font-medium text-white bg-[#0092FF] hover:bg-[#0073CC]"
                          >
                            Back
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <AddAddress
              setAddresses={setAddresses}
              navigate={navigate}
              setError={setError}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function AddAddress({ setAddresses, navigate, setError }:Props) {
  const [houseStreet, setHouseStreet] = useState("");
  const [state, setState] = useState("Delhi");
  const [pincode, setPincode] = useState("");
  const [addressform, setAddressForm] = useState(false);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (houseStreet === "" || pincode === "") {
      setInvalid(true);
    } else if (invalid) {
      setInvalid(false);
    }
  }, [houseStreet, pincode]);

  async function submithandler() {
    let token = localStorage.getItem("token");
    if (token === null || token === undefined) {
      setError("Unauthorized , Please signin again");
      navigate("/signin");
    }
    try {
      const url= import.meta.env.VITE_API_URL || import.meta.env.VITE_DOCKER_URL || 'http://localhost:3000/';
      let result = await axios.post(
        `${url}api/v1/user/addaddress`,
        {
          houseStreet: houseStreet,
          state: state,
          pincode: pincode,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      // console.log(result);
      setAddresses((initial: Address[]) => [...initial, result.data.address]);
      setAddressForm(false);
    } catch (err) {
      // console.log(err);
      setError("Internal Server Error");
      navigate("/error");
      return;
    }
  }
  if (!addressform) {
    return (
      <div className="flex justify-center">
        <button
          onClick={() => {
            setAddressForm(true);
          }}
          type="button"
          className={`mt-6 mb-8  rounded-md px-6 py-3 font-medium text-white
                 bg-[#0092FF] hover:bg-[#0073CC]`}
        >
          Add New Address
        </button>
      </div>
    );
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
                onChange={(e) => {
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
              onChange={(e) => {
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
              onChange={(e) => {
                setPincode(e.target.value);
              }}
              className="flex-shrink-0 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none sm:w-1/6 focus:z-10 focus:border-[#33A8FF] focus:ring-[#33A8FF]"
              placeholder="Pin Code"
            />
          </div>

          {invalid && (
            <div className="flex justify-center">
              <div className="text-red-600">Please Fill Required fields</div>
            </div>
          )}
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
  );
}
