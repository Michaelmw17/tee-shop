"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFoundPage() {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
            <div className="text-8xl mb-4">🤔</div>
          </div>
          
          <h2 className="text-2xl font-serif text-gray-800 mb-4">
            Page Not Found
          </h2>
          
          <p className="text-gray-600 mb-8">
            We&apos;re currently in beta with a simplified experience. 
            The page you&apos;re looking for isn&apos;t available right now.
          </p>
          
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            Take Me Home
          </Link>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Looking for something specific? We&apos;re launching with one product to start.
              <br />
              More coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
