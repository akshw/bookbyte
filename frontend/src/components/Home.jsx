import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { API_URL } from "../config";
import Navbar from "./Navbar";

const sampleBooks = [
  {
    _id: "sample1",
    name: "Can We Be Strangers Again?",
    author: "Matt Haig",
    imageUrl: "https://a.media-amazon.com/images/I/71zpck45b2L._AC_UY218_.jpg",
  },
  {
    _id: "sample2",
    name: "The Theory of Everything",
    author: "Stephen Hawking",
    imageUrl: "https://a.media-amazon.com/images/I/71vfo4cJCjL._AC_UY218_.jpg",
  },
  {
    _id: "sample3",
    name: "The Art of Being Alone",
    author: "Renuks Gavrani",
    imageUrl: "https://a.media-amazon.com/images/I/61Ktyy7KymL._AC_UY218_.jpg",
  },
  {
    _id: "sample4",
    name: "The Alchemist",
    author: "Paulo Coelho",
    imageUrl: "https://a.media-amazon.com/images/I/61HAE8zahLL._AC_UY218_.jpg",
  },
];

const Home = () => {
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
        setBooks(data.data?.length ? data.data : sampleBooks);
      } catch (error) {
        console.error("Failed to fetch books:", error);
        setBooks(sampleBooks);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] text-white font-sans">
      <Navbar />

      <div className="container mx-auto px-6 md:px-12 pt-24 pb-20 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight animate-fade-in-up">
          Discover Your Next
          <span className="block mt-2">Literary Adventure</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto animate-fade-in-up delay-200">
          Explore a universe of books, share your thoughts, and connect with
          fellow book lovers. Your next great read awaits.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up delay-400">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 transition px-8 py-3 text-lg"
          >
            Browse All Books <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/30 text-black hover:bg-gray-300 transition px-8 py-3 text-lg"
          >
            Sign up
          </Button>
        </div>
      </div>

      <section className="container mx-auto px-6 md:px-12 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <h2 className="text-4xl font-bold mb-4 md:mb-0">Featured Reads</h2>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-gray-300 transition"
            asChild
          >
            <Link to="/books">View All Books</Link>
          </Button>
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

      <section className="py-12 bg-gray-950 border-t border-gray-600">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-4xl font-bold mb-5">Stay Connected</h2>
          <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg">
            Get the latest book recommendations, community insights, and
            exclusive offers delivered straight to your inbox.
          </p>

          <form className="max-w-xl mx-auto flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Input
              type="email"
              placeholder="Enter your email address"
              required
              className="flex-1 bg-[#2A2A2A] border border-white/20 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 transition px-8 py-3 text-base"
            >
              Subscribe Now
            </Button>
          </form>
        </div>
      </section>

      <footer className="bg-[#0A0A0A] border-t border-white/10 py-16 mt-1">
        <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-gray-400">
          <div>
            <h3 className="text-2xl font-bold mb-4">BookByte</h3>
            <p className="text-sm mb-4">
              Your digital library companion. Discover, discuss, and dive into
              the world of literature.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/books" className="hover:text-white transition">
                  Explore Books
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-white transition">
                  Reviews
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-white transition">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Get In Touch
            </h4>
            <p className="text-sm mb-2">contact@bookbyte.com</p>
            <p className="text-sm">123 Reading Lane, Bookville, BK 45678</p>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm mt-12 border-t border-white/10 pt-8">
          {new Date().getFullYear()} BookByte. All rights reserved. Built with .
        </div>
      </footer>
    </div>
  );
};

export default Home;
