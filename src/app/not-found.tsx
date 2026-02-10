"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-2 text-center">404</h1>
          <div className="text-8xl mb-4 text-center">🤔</div>
        </div>
        
        <h2 className="text-2xl font-serif text-gray-800 mb-4 text-center">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-md text-center">
          We&apos;re currently in beta with a simplified experience. 
          The page you&apos;re looking for isn&apos;t available right now.
        </p>
        
        <Link
          href="/"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
        >
          Take Me Home
        </Link>
        
        <div className="mt-8 pt-8 border-t border-gray-200 max-w-md">
          <p className="text-sm text-gray-500 text-center">
            Looking for something specific? We&apos;re launching with one product to start.
            <br />
            More coming soon!
          </p>
        </div>
      </div>
    </div>
  );
}
