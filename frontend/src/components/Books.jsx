import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Books = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] text-white font-sans">
      <nav className="w-full px-6 md:px-12 py-5 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
        <Link
          to="/"
          className="text-3xl font-bold tracking-tight hover:opacity-90 transition-opacity"
        >
          BookByte
        </Link>

        <div className="hidden md:flex space-x-8 items-center">
          <Link to="/" className="text-gray-300 hover:text-white transition">
            Home
          </Link>
          <Link
            to="/books"
            className="text-gray-300 hover:text-white transition"
          >
            Explore
          </Link>
          <Link
            to="/reviews"
            className="text-gray-300 hover:text-white transition"
          >
            Reviews
          </Link>
          <Link
            to="/community"
            className="text-gray-300 hover:text-white transition"
          >
            Community
          </Link>
        </div>
        <div className="flex space-x-3 items-center">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-gray-300 hover:text-primary transition"
          >
            Sign up
          </Button>
          <Button className="bg-primary hover:bg-primary/90 transition">
            Get Started
          </Button>
        </div>
      </nav>
    </div>
  );
};
export default Books;
