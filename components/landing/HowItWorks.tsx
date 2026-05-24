'use client';

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Discovery',
      description: 'Sign up and complete your wellness profile. Tell us about your goals, current habits, and what areas you want to improve.',
    },
    {
      number: '2',
      title: 'Strategy & Tracking',
      description: 'Log your mental health check-ins, workouts, meals, sleep, and hydration. Our intuitive interface makes tracking effortless.',
    },
    {
      number: '3',
      title: 'Build & Launch',
      description: 'Receive personalized AI recommendations. Watch your Life Score improve as you build healthier habits day by day.',
    },
    {
      number: '4',
      title: 'Optimize & Scale',
      description: 'Measure performance, refine continuously, and help your wellness journey reach new heights with data-driven insights.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 px-8 sm:px-12 lg:px-16 bg-white dark:bg-gray-950 rounded-[40px] md:rounded-[56px] shadow-xl card-lift relative overflow-hidden">
      {/* Decorative large number */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[20rem] font-black text-gray-50 dark:text-gray-900 pointer-events-none select-none leading-none">
        4
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <p className="section-tag mb-6">// Working Process</p>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.05]">
              Let's See Our
              <br />
              Work Process
            </h2>
          </div>

          {/* Right – steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index}
                className="flex gap-5 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 hover:bg-orange-50 dark:hover:bg-blue-900/20 transition-colors group">
                <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center font-black text-lg shadow-lg transition-all
                  ${index === 3
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 group-hover:bg-orange-500 group-hover:text-white'
                  }`}>
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
