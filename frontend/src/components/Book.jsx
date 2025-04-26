import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_URL } from "../config";
import { Loader2 } from "lucide-react";
import Review from "./Review";
const Book = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/lib/book/${id}`);
        if (!response.ok) throw new Error("Book not found");
        const data = await response.json();
        if (data.success && data.data) {
          setBook(data.data);
        } else {
          setError("Book not found");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch book");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBook();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    if (!id) return;
    setReviewsLoading(true);
    setReviewsError(null);
    fetch(`${API_URL}/api/lib/reviews?bookId=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch reviews");
        return res.json();
      })
      .then((data) => {
        if (data.success && data.data && Array.isArray(data.data.reviews)) {
          setReviews(data.data.reviews);
        } else {
          setReviews([]);
        }
      })
      .catch((err) => setReviewsError(err.message || "Failed to fetch reviews"))
      .finally(() => setReviewsLoading(false));
  }, [id]);

  // Render stars for rating
  const renderStars = (rating = 0) => (
    <span className="inline-flex text-yellow-400 text-lg align-middle">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </span>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#18181B] via-[#23272F] to-[#18181B] text-white font-sans">
      <div className="container mx-auto px-4 py-14 flex flex-col items-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <Loader2 className="animate-spin w-10 h-10 text-primary mb-4" />
            <span className="text-lg font-medium">Loading book details...</span>
          </div>
        ) : error ? (
          <div className="text-red-400 text-center mt-16 p-6 rounded-lg bg-black/60 shadow-lg max-w-xl w-full">
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p>{error}</p>
            <Link
              to="/books"
              className="mt-6 inline-block bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2 rounded transition-colors duration-150 shadow"
            >
              &larr; Back to Books
            </Link>
          </div>
        ) : book ? (
          <>
            <div className="shadow-2xl rounded-2xl border border-gray-800 max-w-3xl w-full flex flex-col md:flex-row overflow-hidden bg-black/80 backdrop-blur-lg">
              <div className="bg-white flex items-center justify-center p-10 md:w-1/2 w-full border-b md:border-b-0 md:border-r border-gray-200">
                <img
                  src={book.imageUrl}
                  alt={book.name}
                  className="max-w-[180px] max-h-[260px] object-contain shadow-lg border border-gray-300 rounded-lg bg-white"
                />
              </div>
              <div className="bg-black/90 flex-1 flex flex-col justify-between px-8 py-10 md:w-1/2 w-full text-white">
                <h1
                  className="text-4xl font-extrabold mb-3 truncate"
                  title={book.name}
                >
                  {book.name}
                </h1>
                <p className="text-lg text-gray-200 mb-2">
                  by <span className="font-semibold text-primary">{book.author || "Unknown Author"}</span>
                </p>
                <p className="text-sm text-gray-400 mb-3">
                  Genre: <span className="font-medium text-gray-300">{book.genre || "N/A"}</span>
                </p>
                <p className="text-base text-gray-100 mt-4 mb-6 whitespace-pre-line leading-relaxed">
                  {book.description || "No description available."}
                </p>
                <div className="text-xs text-gray-500 mt-8">
                  Added by Admin ID: <span className="font-mono text-gray-400">{book.adminId}</span>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="max-w-3xl w-full mt-14">
              <h2 className="text-2xl font-bold mb-7 border-b border-gray-700 pb-2 tracking-tight">Reviews</h2>
              {reviewsLoading ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="animate-spin w-5 h-5" />
                  <span>Loading reviews...</span>
                </div>
              ) : reviewsError ? (
                <div className="text-red-400 bg-black/60 p-3 rounded mb-4">{reviewsError}</div>
              ) : reviews.length === 0 ? (
                <div className="text-gray-400 italic">No reviews yet for this book.</div>
              ) : (
                <div className="flex flex-col gap-7">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-gradient-to-br from-[#23272F] to-[#18181B] border border-gray-700 rounded-xl p-6 flex flex-col gap-2 shadow-md"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-white text-base">
                          {review.user?.name || "Anonymous"}
                        </span>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-gray-200 text-base">
                        {review.reviewText || (
                          <span className="italic text-gray-400">No review text</span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Review Submission Card */}
            <div className="max-w-3xl w-full mt-10 mb-4">
              <div className="bg-black/80 border border-gray-800 rounded-2xl p-7 shadow-xl">
                <h3 className="text-xl font-bold mb-4 text-primary">Leave a Review</h3>
                <Review bookId={id} />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Book;
