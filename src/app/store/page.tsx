import Link from 'next/link';
import Navbar from "@/components/Navbar";

export default function StorePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-center text-gray-800 mb-8 sm:mb-12">
          Browse Our Collections
        </h1>
        
        <div className="grid gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/store/category/affordable" className="group">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 sm:p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-center">
                <span className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 block">👕</span>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-gray-800">Affordable Tees</h2>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Quality basics starting at $19.99</p>
                <span className="text-blue-600 group-hover:underline font-medium text-sm sm:text-base">
                  Shop Now →
                </span>
              </div>
            </div>
          </Link>
          
          <Link href="/store/category/workout" className="group">
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 sm:p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-center">
                <span className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 block">🏃‍♂️</span>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-gray-800">Workout Gear</h2>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Performance tees and singlets</p>
                <span className="text-green-600 group-hover:underline font-medium text-sm sm:text-base">
                  Shop Now →
                </span>
              </div>
            </div>
          </Link>
          
          <Link href="/store/category/premium" className="group sm:col-span-2 lg:col-span-1">
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 sm:p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-center">
                <span className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 block">✨</span>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-gray-800">Premium Collection</h2>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Luxury blends with cashmere</p>
                <span className="text-purple-600 group-hover:underline font-medium text-sm sm:text-base">
                  Shop Now →
                </span>
              </div>
            </div>
          </Link>
        </div>
        
        <div className="mt-12 sm:mt-16 text-center">
          <h3 className="text-xl sm:text-2xl font-serif text-gray-800 mb-3 sm:mb-4">Need Help Finding Your Size?</h3>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Visit one of our store locations for personalized fitting</p>
          <Link 
            href="/" 
            className="bg-gray-800 text-white px-6 sm:px-8 py-2 sm:py-3 rounded hover:bg-gray-700 transition-colors inline-block text-sm sm:text-base"
          >
            Find a Store
          </Link>
        </div>
      </div>
    </div>
  );
}
