import { useEffect, useState } from "react";
import AppAppBar from "../Home/AppAppBar";
import Loader from "../../common/Loader";
import Footer from "../Home/Footer";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface storeInterface {
  storeId: string;
  storeStreet: string;
  state: string;
  pincode: string;
}

interface FormData {
  storeId: string;
}

export function Store() {
  const [Stores, setStores] = useState<storeInterface[]>([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    const Fetchstores = async () => {
      try {
        const response = await fetch("https://dine-ease-project-backend.onrender.com/api/v1/user/allstores");
        const data = await response.json();
        setStores(data["stores"]);
        const validStoreIds = data["stores"].map((store:storeInterface) => store.storeId);
        let store=localStorage.getItem("storeId");
        if (store!==null && store!=="" && store!==undefined && validStoreIds.includes(store)){
          setValue("storeId",store);
        }
      } catch (error) {
        console.error("Failed to fetch Stores: ", error);
        navigate("/error");
         return;
      } finally {
        setLoading(false);
      }
    };

    Fetchstores();
  }, []);

 const onSubmit = (data: FormData) => {
  localStorage.setItem("storeId", data.storeId.toString());
  localStorage.setItem("cart","{}");
  navigate("/menu");
};

  return (
    <div>
      <AppAppBar />
      {loading ? (
        <div>
          <div className="font-semibold text-3xl w-full text-center my-4">Stores</div>
          <div className="bg-gray-50 px-10 pt-10 pb-20 mt-6 mb-20 text-white w-[80%] mx-auto rounded-xl border border-gray-100">
            <Loader />
          </div>
        </div>
      ) : (
        <div>
          <div className="font-semibold text-3xl w-full text-center my-4">Stores</div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-gray-50 px-10 pt-10 pb-20 mt-6 mb-20 text-black w-[80%] mx-auto rounded-xl border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Stores.map((store) => (
                  <div key={store.storeId} className="relative">
                    <input
                      className="peer hidden"
                      id={`radio_store_${store.storeId}`}
                      type="radio"
                      value={store.storeId}
                      {...register("storeId", { required: true })}
                    />
                    <span className="peer-checked:border-blue-500 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                    <label
                      htmlFor={`radio_store_${store.storeId}`}
                      className="peer-checked:border peer-checked:border-blue-500 peer-checked:bg-blue-50 flex cursor-pointer select-none flex-col rounded-lg border border-gray-300 p-4"
                    >
                      <div className="font-semibold text-lg mb-1">Dine Ease</div>
                      <div className="text-gray-700">{store.storeStreet}</div>
                      <div className="text-gray-600">{store.state}</div>
                      <div className="text-gray-500">Pincode: {store.pincode}</div>
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-center items-center">
                {errors.storeId && (
                  <p className="text-red-500 mt-2 text-lg">Please select a store.</p>
                )}
                <p className="text-red-500 mt-2 text-lg">Any items in cart will be cleared</p>
              </div>
              <div className="w-full text-center mt-6">
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-semibold px-6 py-2 rounded hover:bg-blue-600 transition"
                >
                  Continue
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      <Footer />
    </div>
  );
}
