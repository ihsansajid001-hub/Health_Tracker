'use client';

const features = [
  {
    title: 'Mental Health',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
  },
  {
    title: 'Physical Fitness',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
  },
  {
    title: 'Nutrition & Sleep',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 px-8 sm:px-12 lg:px-16 bg-white rounded-[32px] md:rounded-[48px] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold mb-8">
            <span># Features</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Track Every Aspect
            <br />
            of Your Wellness
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${feature.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              </div>
              
              {/* Blue Arrow Badge - Top Right */}
              <div className="absolute top-6 right-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg z-10 transition-transform duration-300 group-hover:scale-110">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>

              {/* Title - Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                <h3 className="text-3xl font-bold text-white">
                  {feature.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
