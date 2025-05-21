import { useEffect, useState } from "react";
import toast from "react-hot-toast";


import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { FaStar } from "react-icons/fa";

interface Review {
  id: number;
  description: string;
  rating: number;
  user: {
    firstName: string;
    lastName: string;
  };
}

interface RatingProps {
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
}


export function Review() {
  const [error,setError]=useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [btnloading,setBtnLoading]=useState(false);
  const [reviewForm, setReviewForm] = useState(false);
  const navigate = useNavigate();
  const { itemId } = useParams();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token=localStorage.getItem("token");
        if (token!==null && token!==undefined && token!=="") {
          setReviewForm(true);
        }
        let response = await axios.get(
        `https://dine-ease-project-backend-bcnq.onrender.com/api/v1/user/viewreviews?itemId=${itemId}`,
        
       );
      setReviews(response.data.reviews);
    } catch (error) {
        toast.error("Couldn't fetch reviews");
        setError("Couldn't fetch reviews");
        navigate("/error");
        return;
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
    setBtnLoading(true);
    if (!token) {
      setReviewForm(false);
      toast.error("Unauthorized. Please sign in again.");
      navigate("/signin");
      return;
    }
    if (description === "" || rating === 0) {
      setInvalid(true);
      return;
    }
    try {
      const response = await axios.post(
        "https://dine-ease-project-backend-bcnq.onrender.com/api/v1/user/dropreview",
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

      setReviews((prev) => [...prev, {
        description:response.data.review.description,
        rating:response.data.review.rating,
        id:response.data.review.id,
        user:{
          firstName:response.data.review.user.firstName,
          lastName:response.data.review.user.lastName
        }
      }]); 
      setDescription("");
      setRating(0);
      toast.success("Review submitted!");
      setBtnLoading(false);
    } catch (error) {
        // console.log(error)
        toast.error("Failed to submit review");
        setBtnLoading(false);
        navigate("/error");
        return;
    }
  };

  if (loading) {
    return (
      <>
      
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-[#33A8FF]" />
      </div>
      
      </>
    );
  } else if (error != "") {
    return (
      <>
      
      <div className="flex items-center justify-center h-screen">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
      
      </>
    );
  }

  return (
    <>
     

      <div className="mb-32 mt-7 px-4 sm:px-10 lg:px-20 xl:px-52">
        {!reviewForm ? (
          <div className="flex justify-center">
            
            <button
              onClick={() =>{
                navigate("/signin");
                toast.error("Signin to post reviews");
              }}
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

            <div className="flex flex-col gap-4 w-full">
              <textarea
                
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write your review"
                className="w-full  rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-[#33A8FF] focus:ring-[#33A8FF]"
              />
              <StarRatingInput rating={rating} setRating={setRating} />
            </div>

            {invalid && (
              <p className="text-red-500 text-sm mt-2">Please fill all required fields correctly</p>
            )}

          {(btnloading)?
            <button type="button"
            className="mt-6 mb-8 flex  gap-3 rounded-md px-6 py-3 font-medium text-white bg-[#0092FF] hover:bg-[#0073CC]"
            disabled >
                <svg aria-hidden="true" className="w-4 h-4 mt-1 text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>Adding...
            </button>:

            <button
              type="button"
              onClick={submitHandler}
              className={`mt-4 rounded-md px-6 py-3 font-medium text-white ${
                description && rating ? "bg-[#0092FF] hover:bg-[#0073CC]" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Submit Review
            </button> }
          </div>
        )}
        <div className="bg-[#EAF8FF] border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-medium mb-4">Customer Reviews</h2>
          {reviews===undefined ||  reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev, index) => (
                <div
                  key={index}
                  className="border  border-gray-200 rounded-md p-4 bg-gray-50 shadow-sm"
                >
                  <div className="flex justify-between mb-1">
                    <div>
                        <div>
                          <span className="font-semibold text-gray-800">
                          Posted By: </span>
                          <span className="text-gray-700">{rev.user.firstName + " " +rev.user.lastName}</span>
                        </div>
                        <div className="flex flex-row">
                        <span className="font-semibold text-gray-800">
                        Rating: </span>
                        <div className="flex flex-row">
                          {[...Array(rev.rating)].map((_, i) => (
                                <FaStar key={i}
                                size={24}
                                color='#FFD700' 
                                />
                          ))}
                         </div>
                         </div>
                     </div>

                    <span className="text-sm text-gray-400">#{index + 1}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">
                    Description: </span>
                    <span className="text-gray-700">{rev.description}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        
      </div>
    </>
  );
}

function StarRatingInput({ rating, setRating }:RatingProps) {
  const [hover, setHover] = useState<number | null>(null);


  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(null)}
          className="focus:outline-none"
        >
          <FaStar
            size={34}
            color={star <= (hover || rating) ? '#FFD700' : '#e4e5e9'}
          />
        </button>
      ))}
    </div>
  );
}