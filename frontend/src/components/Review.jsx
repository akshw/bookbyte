import React, { useState } from "react";
import { API_URL } from "../config";

const AddReview = ({ bookId, onSuccess }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!reviewText.trim() || rating === 0) {
      setError("Please enter review text and select a rating.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/lib/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewText, rating, bookId }),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to submit review");
      }
      setSuccess("Review submitted successfully!");
      setReviewText("");
      setRating(0);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black/80 border border-gray-700 rounded-lg p-6 flex flex-col gap-4 shadow-sm max-w-xl w-full mx-auto"
    >
      <label className="font-semibold text-white text-lg">Add a Review</label>
      <textarea
        className="rounded-md p-3 text-base text-black min-h-[80px] resize-y"
        placeholder="Share your thoughts about this book..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        disabled={loading}
        maxLength={1000}
        required
      />
      <div className="flex items-center gap-2">
        <span className="text-white">Your Rating:</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`text-2xl focus:outline-none transition-colors ${
              (hover || rating) >= star ? "text-yellow-400" : "text-gray-500"
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            disabled={loading}
          >
            ★
          </button>
        ))}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-2 px-6 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/90 transition disabled:bg-gray-600"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {success && <div className="text-green-400 text-sm">{success}</div>}
    </form>
  );
};

export default AddReview;
