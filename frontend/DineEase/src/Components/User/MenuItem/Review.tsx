import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Container } from "../../common/ui/Container";
import { Card } from "../../common/ui/Card";
import { Button } from "../../common/ui/Button";
import { Rating } from "../../common/ui/Rating";
import Loader from "../../common/Loader";
import { apiUrl } from "../../../config/api";

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
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [btnloading, setBtnLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState(false);
  const navigate = useNavigate();
  const { itemId } = useParams();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token !== null && token !== undefined && token !== "") {
          setReviewForm(true);
        }
        const response = await axios.get(apiUrl(`user/viewreviews?itemId=${itemId}`));
        setReviews(response.data.reviews);
      } catch (error) {
        toast.error("Couldn't fetch reviews");
        setError("Couldn't fetch reviews");
        navigate("/error");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    setInvalid(description === "" || rating === 0);
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
      setBtnLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        apiUrl("user/dropreview"),
        { description, rating, itemId: Number(itemId) },
        { headers: { Authorization: token } }
      );
      setReviews((prev) => [
        ...prev,
        {
          description: response.data.review.description,
          rating: response.data.review.rating,
          id: response.data.review.id,
          user: {
            firstName: response.data.review.user.firstName,
            lastName: response.data.review.user.lastName,
          },
        },
      ]);
      setDescription("");
      setRating(0);
      toast.success("Review submitted!");
      setBtnLoading(false);
    } catch (error) {
      toast.error("Failed to submit review");
      setBtnLoading(false);
      navigate("/error");
    }
  };

  if (loading) {
    return (
      <Container className="py-16">
        <Loader />
      </Container>
    );
  }
  if (error) {
    return (
      <Container className="py-16">
        <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4 text-red-700" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="pb-24">
      {!reviewForm ? (
        <div className="mb-10 text-center">
          <Button
            onClick={() => {
              navigate("/signin");
              toast.error("Sign in to post reviews");
            }}
          >
            Sign in to Add a Review
          </Button>
        </div>
      ) : (
        <Card className="mb-10 p-6">
          <h2 className="font-serif text-xl font-bold text-brand-maroon">Leave a Review</h2>
          <p className="mt-1 text-sm text-brand-ink-soft">Share your thoughts about this pickle.</p>

          <div className="mt-4 flex flex-col gap-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your review…"
              rows={3}
              className="w-full rounded-lg border border-brand-cream-dark bg-white px-4 py-3 text-sm text-brand-ink shadow-sm outline-none transition focus:border-brand-maroon focus:ring-2 focus:ring-brand-turmeric/40"
            />
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-brand-ink">Your rating:</span>
              <Rating value={rating} size={28} onChange={setRating} />
            </div>
          </div>

          {invalid && (
            <p className="mt-2 text-sm text-red-600">Please fill all required fields correctly</p>
          )}

          <Button
            className="mt-5"
            onClick={submitHandler}
            loading={btnloading}
            disabled={!description || !rating}
          >
            Submit Review
          </Button>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="font-serif text-xl font-bold text-brand-maroon">Customer Reviews</h2>
        {reviews === undefined || reviews.length === 0 ? (
          <p className="mt-4 text-brand-ink-soft">No reviews yet. Be the first!</p>
        ) : (
          <div className="mt-4 space-y-4">
            {reviews.map((rev, index) => (
              <div key={index} className="rounded-xl border border-brand-cream-dark bg-brand-cream p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-brand-ink">
                      {rev.user.firstName + " " + rev.user.lastName}
                    </p>
                    <Rating value={rev.rating} className="mt-1" />
                  </div>
                  <span className="text-sm text-brand-ink-soft">#{index + 1}</span>
                </div>
                <p className="mt-3 text-brand-ink-soft">{rev.description}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Container>
  );
}
