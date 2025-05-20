import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppAppBar from "../Home/AppAppBar";
import Loader from "../../common/Loader";
import Footer from "../Home/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Review {
  id: number;
  description: string;
  rating: number;
  user: {
    firstName: string;
    lastName: string;
  };
}

export function Review() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const itemId = localStorage.getItem("itemId");
        const token=localStorage.getItem("token");
        if (!itemId) {
          navigate("/menu");
          return;
        }
        if (token==="" || token===undefined) {
            navigate("/signin");
            return;
        }
        let response;
       try {
         response = await axios.get(
        `http://localhost:3000/api/v1/user/viewreviews?itemId=${itemId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } catch (error) {
      console.log(error)
      toast.error("Signin to proceed", { id: "auth-failed-toast" });
      navigate("/signin");
      return;
    }

       setReviews(response.data.reviews);

      } catch (error) {
        toast.error("Couldn't fetch reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    if (description === "" || rating === 0) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }
  }, [description, rating]);

  const submitHandler = async () => {
    const token = localStorage.getItem("token");
    const itemId = localStorage.getItem("itemId");

    if (!token) {
      toast.error("Unauthorized. Please sign in again.");
      navigate("/signin");
      return;
    }

    if (!itemId) {
      navigate("/menu");
      return;
    }

    if (description === "" || rating === 0) {
      setInvalid(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/dropreview",
        {
          description,
          rating,
          itemId:Number(itemId),
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setReviews((prev) => [...prev, response.data.address]); 
      setDescription("");
      setRating(0);
      setReviewForm(false);
      toast.success("Review submitted!");
    } catch (error) {
        console.log(error)
      toast.error("Failed to submit review");
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <AppAppBar />

      <div className="mb-32 mt-7 px-4 sm:px-10 lg:px-20 xl:px-32">
        {!reviewForm ? (
          <div className="flex justify-center">
            <button
              onClick={() => setReviewForm(true)}
              type="button"
              className="mt-6 mb-8 rounded-md px-6 py-3 font-medium text-white bg-[#0092FF] hover:bg-[#0073CC]"
            >
              Add Review
            </button>
          </div>
        ) : (
          <div className="bg-[#EAF8FF] border border-gray-300 rounded-lg p-6 mb-10">
            <h2 className="text-xl font-medium mb-2">Leave a Review</h2>
            <p className="text-gray-400 mb-4">Share your thoughts about the product.</p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write your review"
                className="w-full sm:w-3/4 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-green-500 focus:ring-green-500"
              />

              <input
                type="number"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                placeholder="Rating (1-5)"
                className="w-full sm:w-1/4 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {invalid && (
              <p className="text-red-500 text-sm mt-2">Please fill all required fields correctly</p>
            )}

            <button
              type="button"
              onClick={submitHandler}
              className={`mt-4 rounded-md px-6 py-3 font-medium text-white ${
                description && rating ? "bg-[#0092FF] hover:bg-[#0073CC]" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Submit Review
            </button>
          </div>
        )}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-medium mb-4">Customer Reviews</h2>
          {reviews===undefined ||  reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-md p-4 bg-gray-50 shadow-sm"
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-gray-800">
                     Rating: {rev.rating} ⭐
                    </span>
                    <span className="text-sm text-gray-400">#{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{rev.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
