import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white px-4 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gray-800 mb-6 sm:mb-8">
            Get That Comfort Feeling
          </h2>
        
          
          {/* Hero Image - Responsive */}
          <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-r from-blue-100 to-orange-100 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4">
                <div className="w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-4xl sm:text-5xl lg:text-6xl">👫</span>
                </div>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                  Happy couple wearing our premium tees
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Sections */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Affordable Tees Section */}
          <div className="mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl font-serif text-center mb-6 sm:mb-8 text-gray-800">
              Affordable Tees
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                    <span className="text-3xl sm:text-4xl">👕</span>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h4 className="text-lg sm:text-xl font-semibold mb-2">Basic Cotton Tee #{item}</h4>
                    <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                      100% cotton, comfortable fit, everyday wear
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800">$19.99</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workout Gear Section */}
          <div className="mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl font-serif text-center mb-6 sm:mb-8 text-gray-800">
              Workout Tees & Singlets
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center">
                    <span className="text-3xl sm:text-4xl">🏃‍♂️</span>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h4 className="text-lg sm:text-xl font-semibold mb-2">
                      Performance {item % 2 === 0 ? 'Singlet' : 'Tee'} #{item}
                    </h4>
                    <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                      Moisture-wicking, breathable, perfect for workouts
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800">$29.99</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Collection Section */}
          <div className="mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl font-serif text-center mb-6 sm:mb-8 text-gray-800">
              Premium Collection
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center">
                    <span className="text-3xl sm:text-4xl">✨</span>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h4 className="text-lg sm:text-xl font-semibold mb-2">Cashmere Blend Tee #{item}</h4>
                    <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                      5% cashmere, 95% premium cotton - luxurious comfort
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800">$89.99</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
