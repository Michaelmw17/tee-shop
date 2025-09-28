import Navbar from "@/components/Navbar";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  sizes: string[];
  colors: string[];
}

interface CategoryPageProps {
  params: {
    category: string;
  };
}

async function getProducts(category: string): Promise<Product[]> {
  try {
    const res = await fetch(`http://localhost:3000/api/products/category/${category}`, {
      cache: 'no-store' // For development - use appropriate caching in production
    });
    
    if (!res.ok) {
      return [];
    }
    
    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const awaitedParams = await params;
  const products = await getProducts(awaitedParams.category);

  const categoryNames: Record<string, string> = {
    affordable: 'Affordable Tees',
    workout: 'Workout Gear',
    premium: 'Premium Collection'
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-gray-800 mb-2 sm:mb-4">
            {categoryNames[awaitedParams.category] || awaitedParams.category}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Discover our collection of {awaitedParams.category} tees and apparel
          </p>
        </div>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl">
                    {awaitedParams.category === 'workout' ? '🏃‍♂️' : 
                     awaitedParams.category === 'premium' ? '✨' : '👕'}
                  </span>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">{product.description}</p>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4">
                    <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">${product.price}</p>
                    <div className="text-xs sm:text-sm text-gray-500">
                      {product.sizes.length} sizes available
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.colors.slice(0, 4).map((color) => (
                      <span 
                        key={color} 
                        className="px-2 py-1 bg-gray-200 text-xs rounded"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                  <button className="w-full bg-gray-800 text-white py-2 sm:py-3 px-4 rounded hover:bg-gray-700 transition-colors text-sm sm:text-base">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <p className="text-gray-600 text-base sm:text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
