'use client';

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Create Your Profile',
      description: 'Sign up and complete your wellness profile. Tell us about your goals, current habits, and what areas you want to improve.'
    },
    {
      number: '2',
      title: 'Track Daily Activities',
      description: 'Log your mental health check-ins, workouts, meals, sleep, and hydration. Our intuitive interface makes tracking effortless.'
    },
    {
      number: '3',
      title: 'Get AI Insights',
      description: 'Receive personalized recommendations and insights based on your data. Watch your Life Score improve as you build healthier habits.'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-32 px-8 sm:px-12 lg:px-16 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-[32px] md:rounded-[48px] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
      {/* Large decorative number background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <span className="text-[40rem] font-bold text-gray-900">3</span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Title */}
          <div>
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold mb-8">
              <span># How it Works</span>
            </div>

            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Your Path
              <br />
              to Better Health
            </h2>
          </div>

          {/* Right Side - Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className={`w-14 h-14 ${index === 2 ? 'bg-blue-600' : 'bg-gray-900'} text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg`}>
                    {step.number}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
