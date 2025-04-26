import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { API_URL } from "../config";
import { Loader2 } from "lucide-react";
import Navbar from "./Navbar";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/lib/books`);
        console.log("Fetching from:", response.url);
        if (!response.ok) {
          console.error("API Error:", {
            status: response.status,
            statusText: response.statusText,
          });
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setBooks(data.data?.length ? data.data : []);
      } catch (error) {
        console.error("Failed to fetch books:", error);
        setBooks([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] text-white font-sans">
      <Navbar />
      <section className="container mx-auto px-6 md:px-12 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <h2 className="text-4xl font-bold mb-4 md:mb-0">All Books</h2>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <span className="ml-4 text-xl text-gray-400">Loading books...</span>
          </div>
        )}

        {!isLoading && books.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {books.map((book) => (
              <div
                key={book._id || book.id}
                className="rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <Link to={`/book/${book._id || book.id}`} className="block">
                  <div className="bg-white p-3">
                    <div
                      className="relative mx-auto overflow-hidden"
                      style={{ height: "180px" }}
                    >
                      <img
                        src={
                          book.imageUrl ||
                          "https://via.placeholder.com/400x600?text=No+Image"
                        }
                        alt={book.name}
                        className="mx-auto h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
                      />
                    </div>
                  </div>
                </Link>
                <div className="p-3 bg-black text-white">
                  <h3
                    className="text-white text-md font-semibold mb-1 truncate"
                    title={book.name}
                  >
                    {book.name}
                  </h3>
                  <p
                    className="text-gray-300 text-xs mb-0 truncate"
                    title={book.author || "Unknown Author"}
                  >
                    By {book.author || "Unknown Author"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
export default Books;
