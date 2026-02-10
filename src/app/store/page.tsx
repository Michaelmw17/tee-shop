import Link from 'next/link';
import { redirect } from 'next/navigation';
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { BETA_MODE, BETA_FEATURES, BETA_MESSAGES } from "@/config/beta";
import { getBetaProduct } from "@/lib/products";

export default function StorePage() {
  // Beta mode: Redirect to product or show single product
  if (BETA_MODE && BETA_FEATURES.redirectStoreToProduct) {
    const betaProduct = getBetaProduct();
    if (betaProduct) {
      redirect(`/store/product/${betaProduct.id}`);
    }
  }

  // Beta mode: Show single product focus
  if (BETA_MODE && !BETA_FEATURES.showStoreGrid) {
    const betaProduct = getBetaProduct();
    
    if (!betaProduct) {
      return (
        <div className="min-h-screen bg-white">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-serif text-gray-800 mb-4">Coming Soon</h1>
            <p className="text-gray-600">We&apos;re preparing something special. Check back soon!</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white">
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
          {/* Beta Launch Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Beta Launch
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gray-800 mb-3">
              {BETA_MESSAGES.storeTitle}
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              {BETA_MESSAGES.storeSubtitle}
            </p>
            {BETA_FEATURES.showComingSoon && (
              <p className="text-sm text-gray-500 italic">
                {BETA_MESSAGES.comingSoon}
              </p>
            )}
          </div>

          {/* Beta Product Card */}
          <div className="max-w-md mx-auto">
            <ProductCard product={betaProduct} category={betaProduct.category} />
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="bg-gray-50 p-6 rounded-lg max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Why Beta?</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                This is our first production run. We&apos;re starting small to ensure quality and 
                gather feedback from early supporters. Your purchase helps us perfect the product 
                before we expand the line.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full catalog mode (when beta is disabled)
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
